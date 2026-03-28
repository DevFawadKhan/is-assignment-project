import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { put } from "@vercel/blob";
import { encryptBuffer } from "@/lib/encryption";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // 1. Authorize the user
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
    }

    const secret = process.env.AUTH_SECRET || "fallback_secret_for_development";
    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch (e) {
      return NextResponse.json({ message: "Invalid cryptographic session key." }, { status: 401 });
    }

    const userId = parseInt(decoded.id);

    // 2. Extract standard file streaming binaries
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file detected inside the payload." }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB ceiling
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: "File severely exceeds the 5MB upload limit limit." }, { status: 400 });
    }

    // 3. Prepare Metadata
    const originalName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);
    
    // 4. Crypto Buffer Engineering
    // Scramble the buffer mathematically utilizing robust AES-256-GCM architecture securely.
    const { encryptedBuffer, iv } = encryptBuffer(rawBuffer);

    // 5. Vercel Blob Storage Persistence
    // The underlying storage is now 'private', ensuring no direct public access.
    // The data is already scrambled (AES-256-GCM) for extra structural security.
    const { url } = await put(`encrypted/${crypto.randomUUID()}.${originalName.split('.').pop() || 'bin'}`, encryptedBuffer, {
      access: "private",
      contentType: "application/octet-stream", // Enforcing binary stream handling
    });

    // 6. Prisma Database Integrity Mappings
    const uploadedRecord = await prisma.encryptedFile.create({
      data: {
        filename: url, // Storing the Vercel Blob URL directly
        originalName: originalName,
        mimeType: file.type,
        size: file.size,
        iv: iv,
        userId: userId,
      },
    });

    return NextResponse.json(
      { message: "File securely encrypted natively.", file: uploadedRecord },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Critical Upload Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
