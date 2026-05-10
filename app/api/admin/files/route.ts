import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function getAdminSession(cookieStore: any) {
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, process.env.AUTH_SECRET!);
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

    const files = await prisma.encryptedFile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        recipient: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ files }, { status: 200 });
  } catch(e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
