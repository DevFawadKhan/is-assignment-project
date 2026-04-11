import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    if (!getAdminSession(cookieStore)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const updateData: any = {};

    if (body.hasOwnProperty('isBlocked')) updateData.isBlocked = body.isBlocked;
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.password) {
      if (body.password.length < 6) return NextResponse.json({ message: "Password too short" }, { status: 400 });
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(body.password, salt);
    }

    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    
    return NextResponse.json({ message: "Updated successfully", user: updated });
  } catch(e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    if (!getAdminSession(cookieStore)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    
    // Natively wipe relative constraints via database mappings seamlessly
    await prisma.encryptedFile.deleteMany({
      where: { OR: [ { userId: parseInt(id) }, { recipientId: parseInt(id) } ] }
    });

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    
    return NextResponse.json({ message: "User deleted" });
  } catch(e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
