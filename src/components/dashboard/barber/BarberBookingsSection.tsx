"use client";

import { useEffect, useState } from "react";
import { Panel } from "@/components/dashboard/Panel";
import {
  BookingsList,
} from "@/components/dashboard/barber/BookingsList";
import { SelfBookingForm } from "@/components/dashboard/barber/SelfBookingForm";
import { sortBookings, type BookingDto } from "@/lib/dashboard/bookings";

interface BarberBookingsSectionProps {
  readonly initialBookings: readonly BookingDto[];
}

export function BarberBookingsSection({
  initialBookings,
}: BarberBookingsSectionProps) {
  const [bookings, setBookings] = useState<readonly BookingDto[]>(initialBookings);

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  const handleCreated = (booking: BookingDto) => {
    setBookings((current) => sortBookings([...current, booking]));
  };

  return (
    <>
      <Panel
        title="Ամրագրումներ"
        description="Ընդունիր կամ մերժիր հաճախորդների հայտերը:"
      >
        <BookingsList bookings={bookings} onBookingsChange={setBookings} />
      </Panel>
      <Panel title="Ներքին ամրագրում" description="Ավելացրու ամրագրում ձեռքով:">
        <SelfBookingForm onCreated={handleCreated} />
      </Panel>
    </>
  );
}
