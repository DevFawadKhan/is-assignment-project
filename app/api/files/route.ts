import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.AUTH_SECRET || "fallback_secret_for_development";
    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return NextResponse.json({ message: "Session Invalid" }, { status: 401 });
    }

    const userId = parseInt(decoded.id);

    // Only query AES records securely bound to the authenticated user cleanly natively
    const files = await prisma.encryptedFile.findMany({
      where: { userId: userId },
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        size: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    console.error("Fetch Files Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
