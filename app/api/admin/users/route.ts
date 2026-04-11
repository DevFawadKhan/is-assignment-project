import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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

export async function GET() {
  try {
    const cookieStore = await cookies();
    if (!getAdminSession(cookieStore)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        profileImage: true,
        createdAt: true,
        _count: {
          select: { sentFiles: true, receivedFiles: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch(e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
