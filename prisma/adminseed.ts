import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const adminEmail = "admin@gmail.com";
  const passwordHash = await bcrypt.hash("admin@123", 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: passwordHash,
        role: "ADMIN",
        isBlocked: false,
      },
    });
    console.log("Admin user seeded successfully.");
  } else {
    // If admin exists, ensure password and role are correctly mapped natively
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: passwordHash,
        role: "ADMIN",
        isBlocked: false,
      },
    });
    console.log("Admin user updated successfully.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
