import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { encryptBuffer } from "@/lib/encryption";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // 1. Authorize the user
    // Strictly isolate actions against logged-in payloads utilizing the auth-token cookie natively
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

    // 3. Prevent Directory Traversal Attack Vectors natively
    // We isolate the disk writes utilizing UUIDs ensuring no rogue '.. / ..' path extensions are allowed computational access.
    const originalName = file.name;
    const serverFileName = crypto.randomUUID(); 
    
    // 4. Crypto Buffer Engineering
    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);
    
    // Scramble the buffer mathematically utilizing robust AES-256-GCM architecture securely.
    const { encryptedBuffer, iv } = encryptBuffer(rawBuffer);

    // 5. Protected File System Output
    const uploadDir = path.join(process.cwd(), "uploads");
    const filePath = path.join(uploadDir, serverFileName);
    
    await fs.writeFile(filePath, encryptedBuffer);

    // 6. Prisma Database Integrity Mappings
    const uploadedRecord = await prisma.encryptedFile.create({
      data: {
        filename: serverFileName,
        originalName: originalName, // Maintaining authorized record contexts securely
        mimeType: file.type,
        size: file.size,
        iv: iv, // Critical structural key metric mapping exactly symmetric block cipher vectors together
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
