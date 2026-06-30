import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { mapBarber, mapShop } from "@/lib/data/mappers";
import type {
  BarberShop,
  BarberShopWithBarbers,
  ServiceType,
  ShopFilters,
} from "@/lib/types";

const barberInclude = {
  barber: { include: { serviceDurations: true, certificates: true } },
} satisfies Prisma.MembershipInclude;

export async function listShops(
  filters: ShopFilters = {},
): Promise<readonly BarberShop[]> {
  const where: Prisma.BarberShopWhereInput = { status: "active" };
  if (filters.district) where.district = filters.district;
  if (filters.service) where.services = { has: filters.service };
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { address: { contains: filters.search, mode: "insensitive" } },
      { district: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const shops = await prisma.barberShop.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });
  return shops.map(mapShop);
}

export async function getDistricts(): Promise<readonly string[]> {
  const rows = await prisma.barberShop.findMany({
    distinct: ["district"],
    select: { district: true },
    where: { district: { not: "" }, status: "active" },
    orderBy: { district: "asc" },
  });
  return rows.map((row) => row.district);
}

export async function getShopWithBarbers(
  id: string,
): Promise<BarberShopWithBarbers | null> {
  const shop = await prisma.barberShop.findUnique({
    where: { id },
    include: {
      memberships: {
        where: { status: "confirmed", barber: { status: "active" } },
        include: barberInclude,
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!shop || shop.status !== "active") return null;
  const barbers = shop.memberships.map((m) => mapBarber(m.barber, shop.id));
  return { ...mapShop(shop), barbers };
}

export { asServiceType } from "@/lib/shop-filters";
