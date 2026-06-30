import { prisma } from "@/lib/db";
import { requireBarber } from "@/lib/auth/api";
import { Panel } from "@/components/dashboard/Panel";
import {
  BookingsList,
  type BookingDto,
} from "@/components/dashboard/barber/BookingsList";
import { SelfBookingForm } from "@/components/dashboard/barber/SelfBookingForm";
import type { ServiceType } from "@/lib/types";

const STATUS_ORDER: Record<BookingDto["status"], number> = {
  pending: 0,
  accepted: 1,
  rejected: 2,
};

export default async function BarberBookingsPage() {
  const { barberId } = await requireBarber();
  const bookings = await prisma.booking.findMany({
    where: { barberId },
    orderBy: { startsAt: "asc" },
  });

  const dto: BookingDto[] = bookings
    .map((b) => ({
      id: b.id,
      startsAt: b.startsAt.toISOString(),
      durationMinutes: b.durationMinutes,
      clientName: b.clientName,
      clientPhone: b.clientPhone,
      services: b.services as ServiceType[],
      status: b.status,
      createdByBarber: b.createdByBarber,
    }))
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <div className="flex flex-col gap-6">
      <Panel
        title="Ամրագրումներ"
        description="Ընդունիր կամ մերժիր հաճախորդների հայտերը:"
      >
        <BookingsList bookings={dto} />
      </Panel>
      <Panel title="Ներքին ամրագրում" description="Ավելացրու ամրագրում ձեռքով:">
        <SelfBookingForm />
      </Panel>
    </div>
  );
}
