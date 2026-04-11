import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { decryptBuffer } from "@/lib/encryption";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    // 1. Validating JWT Session securely computationally bridging the environment natively
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized. Please authenticate your browser cookie natively." }, { status: 401 });
    }

    const secret = process.env.AUTH_SECRET || "fallback_secret_for_development";
    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return NextResponse.json({ message: "Corrupt authentication pipeline keys natively." }, { status: 401 });
    }

    const userId = parseInt(decoded.id);

    // 2. Extract requested parameters
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");

    if (!fileId) {
      return NextResponse.json({ message: "File ID severely missing from requested payload constraints." }, { status: 400 });
    }

    // 3. Prisma Database Context Mapping Authentication inherently protecting foreign assets computationally
    const fileRecord = await prisma.encryptedFile.findUnique({
      where: { id: parseInt(fileId) },
    });

    if (!fileRecord) {
      return NextResponse.json({ message: "Encrypted memory blob disconnected or missing completely." }, { status: 404 });
    }

    // Military-grade constraint checking assuring only the strictly mapped authorized user OR implicitly selected recipient unlocks the structural AES payload logically!
    if (fileRecord.userId !== userId && fileRecord.recipientId !== userId) {
      return NextResponse.json({ message: "Forbidden Access: You do not have encrypted ownership permissions associated properly natively." }, { status: 403 });
    }

    // 4. Retrieve the encrypted payload
    let encryptedBuffer: Buffer;

    if (fileRecord.filename.startsWith("http")) {
      // Fetching from Vercel Blob storage (Private Access requires Token)
      const response = await fetch(fileRecord.filename, {
        headers: {
          Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch encrypted buffer from Vercel Blob.");
      }
      const arrayBuffer = await response.arrayBuffer();
      encryptedBuffer = Buffer.from(arrayBuffer);
    } else {
      // Fallback for legacy local files during transition
      const uploadDir = path.join(process.cwd(), "uploads");
      const filePath = path.join(uploadDir, fileRecord.filename);
      encryptedBuffer = await fs.readFile(filePath);
    }

    // 5. Symmetric Mathematical Disassembly mapping precisely generating true payloads natively.
    const decryptedBuffer = decryptBuffer(encryptedBuffer, fileRecord.iv);

    // 6. Clean HTTP flush natively
    const inline = searchParams.get("inline") === "true";
    const headers = new Headers();
    headers.set("Content-Type", fileRecord.mimeType);
    headers.set("Content-Disposition", inline ? "inline" : `attachment; filename="${fileRecord.originalName}"`);
    headers.set("Content-Length", decryptedBuffer.length.toString());

    return new NextResponse(new Uint8Array(decryptedBuffer), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Critical Download Security Constraint Error:", error);
    return NextResponse.json({ message: "Internal server structural decryption faults." }, { status: 500 });
  }
}
