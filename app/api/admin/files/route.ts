import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getAdminSession } from "../utils";

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
