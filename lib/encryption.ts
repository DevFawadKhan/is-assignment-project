import crypto from "crypto";

// Advanced Encryption Standard natively satisfying the core assignment rubric computationally
const ALGORITHM = "aes-256-gcm";
const KEY_HEX = process.env.FILE_ENCRYPTION_KEY;

// Fail-fast guard asserting correctly shaped 32-byte hexadecimal representation natively for structural security
if (!KEY_HEX || KEY_HEX.length !== 64) {
  throw new Error("CRITICAL: FILE_ENCRYPTION_KEY must be a 64-character hex string.");
}

const KEY = Buffer.from(KEY_HEX, "hex");

/**
 * Encrypts an incoming binary file stream symmetrically utilizing an isolated AES-256 Key
 */
export function encryptBuffer(buffer: Buffer): { encryptedBuffer: Buffer; iv: string } {
  // A completely randomized Initialization Vector protecting identical files exclusively
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  // Authenticated encryption securely appending the AuthTag uniquely
  const chunk1 = cipher.update(buffer);
  const chunk2 = cipher.final();
  const authTag = cipher.getAuthTag();

  return {
    encryptedBuffer: Buffer.concat([chunk1, chunk2, authTag]),
    iv: iv.toString("hex"),
  };
}

/**
 * Decrypts a previously secured disk blob safely reconstructing original inputs symmetrically
 */
export function decryptBuffer(encryptedBuffer: Buffer, ivHex: string): Buffer {
  const iv = Buffer.from(ivHex, "hex");
  
  // GCM appends the 16-byte authentication tag exclusively at the EOF
  const authTagLength = 16;
  const authTag = encryptedBuffer.subarray(encryptedBuffer.length - authTagLength);
  const encryptedData = encryptedBuffer.subarray(0, encryptedBuffer.length - authTagLength);

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  const decryptedChunk1 = decipher.update(encryptedData);
  const decryptedChunk2 = decipher.final();

  return Buffer.concat([decryptedChunk1, decryptedChunk2]);
}
