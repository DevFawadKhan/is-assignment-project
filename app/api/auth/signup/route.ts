import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields: name, email, password" },
        { status: 400 },
      );
    }

    // Password Complexity Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character." },
        { status: 400 },
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 409 },
      );
    }

    // Hash the password safely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // The Prisma schema sets role to USER by default
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
