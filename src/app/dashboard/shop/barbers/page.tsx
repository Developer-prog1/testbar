import { prisma } from "@/lib/db";
import { requireOwnerShop } from "@/lib/auth/api";
import { Panel } from "@/components/dashboard/Panel";
import {
  BarbersManager,
  type MembershipDto,
} from "@/components/dashboard/owner/BarbersManager";
import { resolveImageSrc } from "@/lib/images";

export default async function OwnerBarbersPage() {
  const { shopId } = await requireOwnerShop();
  const memberships = await prisma.membership.findMany({
    where: { shopId },
    include: { barber: { include: { user: true } } },
    orderBy: { createdAt: "asc" },
  });

  const toDto = (m: (typeof memberships)[number]): MembershipDto => ({
    id: m.id,
    status: m.status,
    initiatedBy: m.initiatedBy,
    name: `${m.barber.firstName} ${m.barber.lastName}`.trim(),
    email: m.barber.user.email,
    photoSrc: resolveImageSrc(m.barber.photoId, m.barber.photoUrl),
  });

  const confirmed = memberships.filter((m) => m.status === "confirmed").map(toDto);
  const pending = memberships.filter((m) => m.status === "pending").map(toDto);

  return (
    <Panel
      title="Վարսավիրներ"
      description="Հրավիրիր, հաստատիր կամ հեռացրու քո խանութի վարսավիրներին:"
    >
      <BarbersManager confirmed={confirmed} pending={pending} />
    </Panel>
  );
}
