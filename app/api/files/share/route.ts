import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const secret = process.env.AUTH_SECRET || "fallback_secret_for_development";
    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return NextResponse.json({ message: "Session Invalid" }, { status: 401 });
    }

    const userId = parseInt(decoded.id);
    const body = await req.json();
    const { fileId, recipientId } = body;

    if (!fileId || !recipientId) {
       return NextResponse.json({ message: "Missing fileId or recipientId." }, { status: 400 });
    }

    // Verify cryptographic ownership logistically
    const file = await prisma.encryptedFile.findUnique({ where: { id: parseInt(fileId) }});
    
    if (!file) {
        return NextResponse.json({ message: "Encrypted memory blob disconnected or missing completely." }, { status: 404 });
    }

    if (file.userId !== userId) {
        return NextResponse.json({ message: "Forbidden Access: You do not have ownership permissions to share this payload." }, { status: 403 });
    }

    // Modify the recipient relation pointer securely
    await prisma.encryptedFile.update({
        where: { id: parseInt(fileId) },
        data: { recipientId: parseInt(recipientId) }
    });

    return NextResponse.json({ message: "File securely shared." }, { status: 200 });

  } catch (error) {
    console.error("Share File API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
