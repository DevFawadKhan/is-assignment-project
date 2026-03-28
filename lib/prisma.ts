// import { PrismaClient } from "@/app/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import pg from "pg";
// import fs from "fs";
// import path from "path";
// const { Pool } = pg;

// declare global {
//   var prisma: ReturnType<typeof createPrismaClient> | undefined;
// }

// const createPrismaClient = () => {
//   return new PrismaClient({
//     adapter,
//     log:
//       process.env.NODE_ENV === "development"
//         ? ["query", "error", "warn"]
//         : ["error"],
//   });
// };

// // Create a connection pool
// const connectionString = process.env.DATABASE_URL;
// const pool = new Pool({
//   connectionString,
//   max: 20, // Maximum number of clients in the pool
//   idleTimeoutMillis: 10000, // How long a client is allowed to remain idle before being closed
//   connectionTimeoutMillis: 10000, // How long to wait for a connection
//   // ssl: {
//   //   rejectUnauthorized: false,   false when your not using ssl certificate
//   // },
//   ssl: {
//     ca: fs.readFileSync(path.join(process.cwd(), "ca-cert.pem")).toString(),
//     rejectUnauthorized: true,
//   },
// });

// const adapter = new PrismaPg(pool);

// export const prisma = globalThis.prisma || createPrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalThis.prisma = prisma;
// }

// export default prisma;

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

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

// Prepare the SSL configuration
const sslConfig = process.env.CA_CERT
  ? {
      // If CA_CERT contains literal newlines (like from Vercel), use it directly.
      // If it contains escaped \n, replace them with actual newlines.
      ca: process.env.CA_CERT.replace(/\\n/g, '\n'),
      rejectUnauthorized: true, // validates the certificate
    }
  : undefined; // fallback to no SSL or use other settings if needed

// Create a connection pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  ssl: sslConfig,
});

const adapter = new PrismaPg(pool);

export const prisma = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;