import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import { del } from "@vercel/blob";
import { cookies } from "next/headers";

export async function DELETE(req: Request) {
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

    if (!fileRecord) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // Authorization check: only the owner can delete their files
    if (fileRecord.userId !== userId) {
      return NextResponse.json({ message: "Forbidden: Not your file" }, { status: 403 });
    }

    // 1. Delete from storage (Cloud or Local)
    if (fileRecord.filename.startsWith("http")) {
      await del(fileRecord.filename);
    } else {
      const uploadDir = path.join(process.cwd(), "uploads");
      const filePath = path.join(uploadDir, fileRecord.filename);
      try {
        await fs.unlink(filePath);
      } catch (e) {
        console.error("Warning: Local file not found during deletion", e);
      }
    }

    // 2. Delete from the database
    await prisma.encryptedFile.delete({
      where: { id: fileRecord.id },
    });

    return NextResponse.json({ message: "File successfully deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
