import { prisma } from "@/lib/db";
import { resolveImageSrc } from "@/lib/images";
import type { AdminBarberRow, AdminShopRow } from "@/lib/types";

export async function listAdminShops(): Promise<readonly AdminShopRow[]> {
  const shops = await prisma.barberShop.findMany({
    orderBy: { createdAt: "desc" },
  });
  return shops.map((shop) => ({
    id: shop.id,
    name: shop.name,
    imageUrl: resolveImageSrc(shop.imageId, shop.imageUrl),
    district: shop.district,
    address: shop.address,
    status: shop.status,
    createdAt: shop.createdAt.toISOString(),
  }));
}

const toBarberRow = (barber: {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  photoId: string | null;
  photoUrl: string | null;
  status: AdminBarberRow["status"];
  createdAt: Date;
  user: { email: string };
}): AdminBarberRow => ({
  id: barber.id,
  firstName: barber.firstName,
  lastName: barber.lastName,
  phone: barber.phone,
  email: barber.user.email,
  photoUrl: resolveImageSrc(barber.photoId, barber.photoUrl),
  status: barber.status,
  createdAt: barber.createdAt.toISOString(),
});

export async function listAdminBarbers(): Promise<readonly AdminBarberRow[]> {
  const barbers = await prisma.barber.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } },
  });
  return barbers.map(toBarberRow);
}

export async function listAdminBarbersByShop(
  shopId: string,
): Promise<readonly AdminBarberRow[]> {
  const barbers = await prisma.barber.findMany({
    where: { memberships: { some: { shopId } } },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } },
  });
  return barbers.map(toBarberRow);
}
