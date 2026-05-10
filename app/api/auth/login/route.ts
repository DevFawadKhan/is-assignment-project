import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing email or password" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Deny suspended accounts natively
    if (user.isBlocked) {
      return NextResponse.json(
        { message: "Your account has been suspended by an administrator." },
        { status: 403 }
      );
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create the JWT custom payload
    const secret = process.env.AUTH_SECRET!;
    const token = jwt.sign(
      {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: "7d" } // expires in 7 days
    );

    // Create a strict HTTP-Only cookie for maximum security against XSS
    const response = NextResponse.json(
      { message: "Logged in successfully", user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 }
    );

    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/",
      sameSite: "lax", // 'lax' prevents CSRF broadly while still allowing main-domain navigation
    });

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
