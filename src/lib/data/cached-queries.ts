import { unstable_cache } from "next/cache";
import { listShops, getDistricts } from "@/lib/data/queries";
import { asServiceType } from "@/lib/shop-filters";
import { listHeroImages } from "@/lib/data/site";
import type { ShopFilters } from "@/lib/types";

const SHOPS_REVALIDATE_SECONDS = 60;
const DISTRICTS_REVALIDATE_SECONDS = 300;
const HERO_REVALIDATE_SECONDS = 120;

export const getCachedHeroImages = unstable_cache(
  listHeroImages,
  ["hero-images"],
  { revalidate: HERO_REVALIDATE_SECONDS, tags: ["hero"] },
);

export const getCachedDistricts = unstable_cache(
  getDistricts,
  ["districts"],
  { revalidate: DISTRICTS_REVALIDATE_SECONDS, tags: ["shops"] },
);

export const getCachedShopsAll = unstable_cache(
  () => listShops(),
  ["shops-all"],
  { revalidate: SHOPS_REVALIDATE_SECONDS, tags: ["shops"] },
);

async function fetchFilteredShops(
  district: string,
  service: string,
  search: string,
) {
  const filters: ShopFilters = {
    district: district || undefined,
    service: asServiceType(service || undefined),
    search: search || undefined,
  };
  return listShops(filters);
}

export const getCachedShopsFiltered = unstable_cache(
  fetchFilteredShops,
  ["shops-filtered"],
  { revalidate: SHOPS_REVALIDATE_SECONDS, tags: ["shops"] },
);
