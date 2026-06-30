import Image from "next/image";
import type { Barber } from "@/lib/types";

interface BarberCardProps {
  readonly barber: Barber;
  readonly onSelect: (barber: Barber) => void;
}

export function BarberCard({ barber, onSelect }: BarberCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(barber)}
      className="group flex items-center gap-4 rounded-card border border-line bg-panel p-4 text-left transition-colors hover:border-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={barber.photoUrl}
          alt={`${barber.firstName} ${barber.lastName}`}
          fill
          sizes="80px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="font-display text-lg font-semibold group-hover:text-gold">
          {barber.firstName} {barber.lastName}
        </h3>
        <p className="text-sm text-muted">{barber.specialty}</p>
        <p className="text-xs text-gold">{barber.yearsExperience} տարվա փորձ</p>
      </div>
      <span
        aria-hidden="true"
        className="text-gold opacity-0 transition-opacity group-hover:opacity-100"
      >
        →
      </span>
    </button>
  );
}
