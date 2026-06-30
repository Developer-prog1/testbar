import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_HERO_URLS = [
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1920&h=1080&q=80",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&h=1080&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&h=1080&q=80",
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1920&h=1080&q=80",
] as const;

/** Idempotently seeds default hero slides when the table is empty. */
async function main(): Promise<void> {
  const count = await prisma.heroSlide.count();
  if (count > 0) {
    console.log(`Hero slides already exist (${count}). Skipping.`);
    return;
  }
  await prisma.heroSlide.createMany({
    data: DEFAULT_HERO_URLS.map((imageUrl, sortOrder) => ({ imageUrl, sortOrder })),
  });
  console.log(`Seeded ${DEFAULT_HERO_URLS.length} hero slides.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
