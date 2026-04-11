import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const secret = process.env.AUTH_SECRET || "fallback_secret_for_development";
    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch (e) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const formDataReq = await req.formData();
    const name = formDataReq.get("name") as string | null;
    const password = formDataReq.get("password") as string | null;
    const file = formDataReq.get("profileImage") as File | null;

    const updateData: any = {};
    if (name) {
      updateData.name = name;
    }
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (file && file.size > 0) {
      // Basic implementation for storing the avatar locally mirroring raw API paths logic functionally, 
      // ensuring proper blob mappings are inherently mapped natively.
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `avatar-${decoded.id}-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      
      // Native Vercel Blob vs Local execution conditional routing dynamically tracking ownership natively!
      if (process.env.BLOB_READ_WRITE_TOKEN) {
         try {
           const { put } = await import('@vercel/blob');
           const blob = await put(`avatars/${filename}`, file, {
             access: 'public',
             token: process.env.BLOB_READ_WRITE_TOKEN
           });
           updateData.profileImage = blob.url;
         } catch(e) {
             const fs = await import("fs/promises");
             const path = await import("path");
             const uploadDir = path.join(process.cwd(), "public/avatars");
             await fs.mkdir(uploadDir, { recursive: true });
             await fs.writeFile(path.join(uploadDir, filename), buffer);
             updateData.profileImage = `/avatars/${filename}`; 
         }
      } else {
        const fs = await import("fs/promises");
        const path = await import("path");
        const uploadDir = path.join(process.cwd(), "public/avatars");
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, filename), buffer);
        updateData.profileImage = `/avatars/${filename}`;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No data provided to update." }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(decoded.id) },
      data: updateData,
      select: {
         id: true,
         name: true,
         email: true,
         profileImage: true,
      }
    });

    return NextResponse.json({ message: "Profile updated successfully.", user: updatedUser }, { status: 200 });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
