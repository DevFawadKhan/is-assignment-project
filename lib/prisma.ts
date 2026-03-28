import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";
const { Pool } = pg;

declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

// Create a connection pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 10000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 10000, // How long to wait for a connection
  // ssl: {
  //   rejectUnauthorized: false,   false when your not using ssl certificate
  // },
  ssl: {
    ca: fs.readFileSync(path.join(process.cwd(), "ca-cert.pem")).toString(),
    rejectUnauthorized: true,
  },
});

const adapter = new PrismaPg(pool);

export const prisma = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
