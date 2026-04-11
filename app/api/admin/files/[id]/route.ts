import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { del } from '@vercel/blob';

function getAdminSession(cookieStore: any) {
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, process.env.AUTH_SECRET || "fallback_secret_for_development");
    if (decoded.role !== "ADMIN") return null;
    return decoded;
  } catch (e) {
    return null;
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    if (!getAdminSession(cookieStore)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    
    // Retrieve file tracking URI natively so we can purge the Vercel Blob dynamically
    const file = await prisma.encryptedFile.findUnique({
      where: { id: parseInt(id) }
    });

    if (file && file.filename.startsWith('http') && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(file.filename, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch(e) {
        console.error("Vercel Blob external purge failed:", e);
      }
    }

    await prisma.encryptedFile.delete({
      where: { id: parseInt(id) },
    });
    
    return NextResponse.json({ message: "Encrypted payload destroyed natively." });
  } catch(e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
