import { prisma } from "@/lib/db";
import { requireBarber } from "@/lib/auth/api";
import { Panel } from "@/components/dashboard/Panel";
import { BarberProfileForm } from "@/components/dashboard/barber/BarberProfileForm";
import { ShopJoin } from "@/components/dashboard/barber/ShopJoin";
import {
  CertificatesManager,
  type CertificateDto,
} from "@/components/dashboard/barber/CertificatesManager";
import { resolveImageSrc } from "@/lib/images";

export default async function BarberProfilePage() {
  const { barberId } = await requireBarber();
  const [barber, shops] = await Promise.all([
    prisma.barber.findUniqueOrThrow({
      where: { id: barberId },
      include: {
        certificates: { orderBy: { year: "desc" } },
        memberships: { include: { shop: true }, orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.barberShop.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const certificates: CertificateDto[] = barber.certificates.map((c) => ({
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    year: c.year,
    imageSrc: resolveImageSrc(c.imageId, c.imageUrl),
  }));

  const memberships = barber.memberships.map((m) => ({
    id: m.id,
    shopName: m.shop.name,
    status: m.status,
    initiatedBy: m.initiatedBy,
  }));

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Իմ էջը" description="Տվյալներ, որ երևում են խանութի էջում:">
        <BarberProfileForm
          profile={{
            firstName: barber.firstName,
            lastName: barber.lastName,
            specialty: barber.specialty,
            yearsExperience: barber.yearsExperience,
            photoId: barber.photoId,
            photoSrc: barber.photoId
              ? resolveImageSrc(barber.photoId, barber.photoUrl)
              : null,
          }}
        />
      </Panel>

      <Panel title="Խանութ" description="Ընտրիր որ barber shop-ում ես աշխատում:">
        <ShopJoin memberships={memberships} shops={shops} />
      </Panel>

      <Panel title="Սերտիֆիկատներ" description="Ավելացրու քո որակավորումները:">
        <CertificatesManager certificates={certificates} />
      </Panel>
    </div>
  );
}
