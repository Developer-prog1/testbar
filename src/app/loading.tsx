import { HeroSkeleton } from "@/components/home/HeroSkeleton";
import { ShopGallerySkeleton } from "@/components/home/ShopGallerySkeleton";

export default function RootLoading() {
  return (
    <>
      <HeroSkeleton />
      <ShopGallerySkeleton />
    </>
  );
}
