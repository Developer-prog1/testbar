import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireBarber } from "@/lib/auth/api";
import { BarberBookingsSection } from "@/components/dashboard/barber/BarberBookingsSection";
import { sortBookings } from "@/lib/dashboard/bookings";
import { PanelSkeleton } from "@/components/ui/PanelSkeleton";
import type { ServiceType } from "@/lib/types";
async function BookingsData() {
  const { barberId } = await requireBarber();
  const bookings = await prisma.booking.findMany({
    where: { barberId },
    orderBy: { startsAt: "asc" },
  });

  const dto = sortBookings(
    bookings.map((booking) => ({
      id: booking.id,
      startsAt: booking.startsAt.toISOString(),
      durationMinutes: booking.durationMinutes,
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      services: booking.services as ServiceType[],
      status: booking.status,
      createdByBarber: booking.createdByBarber,
    })),
  );

  return <BarberBookingsSection initialBookings={dto} />;
}

export default function BarberBookingsPage() {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <BookingsData />
    </Suspense>
  );
}
