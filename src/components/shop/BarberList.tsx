"use client";

import { useState } from "react";
import { BarberCard } from "@/components/shop/BarberCard";
import { BookingModal } from "@/components/booking/BookingModal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Barber, ServiceType } from "@/lib/types";

interface BarberListProps {
  readonly barbers: readonly Barber[];
  readonly shopName: string;
  readonly services: readonly ServiceType[];
}

export function BarberList({ barbers, shopName, services }: BarberListProps) {
  const [selected, setSelected] = useState<Barber | null>(null);

  return (
    <section className="py-12 sm:py-16">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Վարպետներ"
          title="Ընտրիր քո վարպետին"
          description="Սեղմիր վարպետի վրա՝ ազատ ժամ ընտրելու և ամրագրելու համար:"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {barbers.map((barber) => (
            <BarberCard key={barber.id} barber={barber} onSelect={setSelected} />
          ))}
        </div>
      </Container>

      {selected ? (
        <BookingModal
          barber={selected}
          shopName={shopName}
          services={services}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </section>
  );
}
