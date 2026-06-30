import type { BarberShop, ServiceType, ShopFilters } from "@/lib/types";

const SERVICE_TYPES: readonly ServiceType[] = [
  "haircut",
  "beard",
  "shave",
  "kids",
  "styling",
];

export const asServiceType = (
  value: string | undefined,
): ServiceType | undefined =>
  value && SERVICE_TYPES.includes(value as ServiceType)
    ? (value as ServiceType)
    : undefined;

const includesIgnoreCase = (haystack: string, needle: string): boolean =>
  haystack.toLowerCase().includes(needle.toLowerCase());

/** Client-side shop filtering — mirrors server `listShops` filter rules. */
export function filterShops(
  shops: readonly BarberShop[],
  filters: ShopFilters,
): readonly BarberShop[] {
  return shops.filter((shop) => {
    if (filters.district && shop.district !== filters.district) return false;
    if (filters.service && !shop.services.includes(filters.service)) return false;
    if (filters.search) {
      const query = filters.search;
      const matches =
        includesIgnoreCase(shop.name, query) ||
        includesIgnoreCase(shop.address, query) ||
        includesIgnoreCase(shop.district, query);
      if (!matches) return false;
    }
    return true;
  });
}
