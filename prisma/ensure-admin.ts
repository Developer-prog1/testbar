import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

const email = (process.env.ADMIN_EMAIL ?? "admin@test.am").toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "Admin123!";

/** Idempotently ensures an admin account exists (does not wipe data). */
async function main(): Promise<void> {
  const passwordHash = await hash(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "admin" },
    create: { email, passwordHash, role: "admin" },
  });
  console.log(`Admin ready: ${user.email} (role=${user.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
