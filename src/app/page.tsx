import { Hero } from "@/components/home/Hero";
import { ShopGallery } from "@/components/home/ShopGallery";
import { AboutSection } from "@/components/home/AboutSection";
import { listShops } from "@/lib/data/queries";

export default async function HomePage() {
  const shops = await listShops();

  return (
    <>
      <Hero />
      <ShopGallery shops={shops} />
      <AboutSection />
    </>
  );
}
