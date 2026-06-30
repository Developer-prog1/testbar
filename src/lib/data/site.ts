import { prisma } from "@/lib/db";
import { HERO_IMAGES } from "@/lib/constants";
import { resolveImageSrc } from "@/lib/images";
import type { AdminContactMessage, HeroSlideRow } from "@/lib/types";

export async function listHeroImages(): Promise<readonly string[]> {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });
  if (slides.length === 0) return HERO_IMAGES;
  return slides.map((slide) => resolveImageSrc(slide.imageId, slide.imageUrl));
}

export async function listHeroSlides(): Promise<readonly HeroSlideRow[]> {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return slides.map((slide) => ({
    id: slide.id,
    imageUrl: resolveImageSrc(slide.imageId, slide.imageUrl),
    sortOrder: slide.sortOrder,
  }));
}

export async function listAdminMessages(): Promise<readonly AdminContactMessage[]> {
  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    contact: row.contact,
    message: row.message,
    createdAt: row.createdAt.toISOString(),
  }));
}
