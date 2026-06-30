import { AboutSection } from "@/components/home/AboutSection";
import { Hero } from "@/components/home/Hero";
import { ShopGallery } from "@/components/home/ShopGallery";
import { getCachedHeroImages, getCachedShopsAll } from "@/lib/data/cached-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [images, shops] = await Promise.all([
    getCachedHeroImages(),
    getCachedShopsAll(),
  ]);

  return (
    <>
      <Hero images={images} />
      <ShopGallery shops={shops} />
      <AboutSection />
    </>
  );
}
