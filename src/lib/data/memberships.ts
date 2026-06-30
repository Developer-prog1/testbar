import { prisma } from "@/lib/db";
import { ApiError } from "@/lib/auth/api";
import type { SessionUser } from "@/lib/auth/current-user";

export async function inviteBarberByEmail(
  shopId: string,
  email: string,
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { barber: true },
  });
  if (!user || !user.barber) throw new ApiError(404, "barber_not_found");

  await prisma.membership.upsert({
    where: { barberId_shopId: { barberId: user.barber.id, shopId } },
    update: {},
    create: {
      barberId: user.barber.id,
      shopId,
      status: "pending",
      initiatedBy: "owner",
    },
  });
}

export async function requestJoin(
  barberId: string,
  shopId: string,
): Promise<void> {
  const shop = await prisma.barberShop.findUnique({ where: { id: shopId } });
  if (!shop) throw new ApiError(404, "shop_not_found");

  await prisma.membership.upsert({
    where: { barberId_shopId: { barberId, shopId } },
    update: {},
    create: { barberId, shopId, status: "pending", initiatedBy: "barber" },
  });
}

const loadMembership = async (id: string) => {
  const membership = await prisma.membership.findUnique({
    where: { id },
    include: { shop: true },
  });
  if (!membership) throw new ApiError(404, "membership_not_found");
  return membership;
};

const assertParticipant = (
  membership: { shop: { ownerId: string }; barberId: string },
  user: SessionUser,
): void => {
  const isOwner = membership.shop.ownerId === user.id;
  const isBarber = user.barber?.id === membership.barberId;
  if (!isOwner && !isBarber) throw new ApiError(403, "forbidden");
};

/** Confirm a pending membership; only the counterparty (not the initiator) may confirm. */
export async function confirmMembership(
  id: string,
  user: SessionUser,
): Promise<void> {
  const membership = await loadMembership(id);
  assertParticipant(membership, user);

  const counterpartyIsOwner = membership.initiatedBy === "barber";
  const actingAsOwner = user.role === "owner";
  if (counterpartyIsOwner !== actingAsOwner) {
    throw new ApiError(403, "not_counterparty");
  }

  await prisma.membership.update({
    where: { id },
    data: { status: "confirmed" },
  });
}

export async function removeMembership(
  id: string,
  user: SessionUser,
): Promise<void> {
  const membership = await loadMembership(id);
  assertParticipant(membership, user);
  await prisma.membership.delete({ where: { id } });
}
