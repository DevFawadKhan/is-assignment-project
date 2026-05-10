import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const secret = process.env.AUTH_SECRET!;
    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return NextResponse.json({ message: "Session Invalid" }, { status: 401 });
    }

    // Explicitly excluding passwords and sensitive flags during Edge fetching natively
    const users = await prisma.user.findMany({
      where: {
        id: { not: parseInt(decoded.id) } // Don't return the logged-in user in the recipient dropdown!
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Fetch Users API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
