import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.AUTH_SECRET!;
    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return NextResponse.json({ message: "Session Invalid" }, { status: 401 });
    }

    const userId = parseInt(decoded.id);
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");

    if (!fileId) {
      return NextResponse.json({ message: "File ID missing" }, { status: 400 });
    }

    const fileRecord = await prisma.encryptedFile.findUnique({
      where: { id: parseInt(fileId) },
    });

    if (!fileRecord || (fileRecord.userId !== userId && fileRecord.recipientId !== userId)) {
      return NextResponse.json({ message: "Access Denied" }, { status: 403 });
    }

    let encryptedBuffer: Buffer;

    if (fileRecord.filename.startsWith("http")) {
      const response = await fetch(fileRecord.filename, {
        headers: {
          Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch from storage");
      }
      const arrayBuffer = await response.arrayBuffer();
      encryptedBuffer = Buffer.from(arrayBuffer);
    } else {
      const uploadDir = path.join(process.cwd(), "uploads");
      const filePath = path.join(uploadDir, fileRecord.filename);
      encryptedBuffer = await fs.readFile(filePath);
    }

    const download = searchParams.get("download") === "true";

    // We serve this as text/plain so the browser displays the scrambled "garbage" characters 
    // to prove the file is actually encrypted on the disk.
    return new NextResponse(new Uint8Array(encryptedBuffer), {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": download ? `attachment; filename="${fileRecord.originalName}.encrypted"` : "inline", 
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
