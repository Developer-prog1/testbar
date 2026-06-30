import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireBarber } from "@/lib/auth/api";
import { Panel } from "@/components/dashboard/Panel";
import { BarberProfileForm } from "@/components/dashboard/barber/BarberProfileForm";
import { ShopJoin } from "@/components/dashboard/barber/ShopJoin";
import {
  CertificatesManager,
  type CertificateDto,
} from "@/components/dashboard/barber/CertificatesManager";
import { PanelSkeleton } from "@/components/ui/PanelSkeleton";
import { resolveImageSrc } from "@/lib/images";

async function ProfilePanel() {
  const { barberId } = await requireBarber();
  const barber = await prisma.barber.findUniqueOrThrow({
    where: { id: barberId },
    select: {
      firstName: true,
      lastName: true,
      specialty: true,
      yearsExperience: true,
      photoId: true,
      photoUrl: true,
    },
  });

  return (
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
  );
}

async function ShopJoinPanel() {
  const { barberId } = await requireBarber();
  const [memberships, shops] = await Promise.all([
    prisma.membership.findMany({
      where: { barberId },
      include: { shop: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.barberShop.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <Panel title="Խանութ" description="Ընտրիր որ barber shop-ում ես աշխատում:">
      <ShopJoin
        memberships={memberships.map((membership) => ({
          id: membership.id,
          shopName: membership.shop.name,
          status: membership.status,
          initiatedBy: membership.initiatedBy,
        }))}
        shops={shops}
      />
    </Panel>
  );
}

async function CertificatesPanel() {
  const { barberId } = await requireBarber();
  const certificates = await prisma.certificate.findMany({
    where: { barberId },
    orderBy: { year: "desc" },
  });

  const dto: CertificateDto[] = certificates.map((certificate) => ({
    id: certificate.id,
    title: certificate.title,
    issuer: certificate.issuer,
    year: certificate.year,
    imageSrc: resolveImageSrc(certificate.imageId, certificate.imageUrl),
  }));

  return (
    <Panel title="Սերտիֆիկատներ" description="Ավելացրու քո որակավորումները:">
      <CertificatesManager certificates={dto} />
    </Panel>
  );
}

export default function BarberProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<PanelSkeleton />}>
        <ProfilePanel />
      </Suspense>
      <Suspense fallback={<PanelSkeleton />}>
        <ShopJoinPanel />
      </Suspense>
      <Suspense fallback={<PanelSkeleton />}>
        <CertificatesPanel />
      </Suspense>
    </div>
  );
}
