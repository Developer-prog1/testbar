"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { DayPicker } from "@/components/booking/DayPicker";
import { SlotGrid } from "@/components/booking/SlotGrid";
import { BookingForm } from "@/components/booking/BookingForm";
import { CertificateList } from "@/components/booking/CertificateList";
import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { fetchSlots } from "@/lib/api-client";
import { formatDateTime, getUpcomingDays } from "@/lib/datetime";
import {
  formatDuration,
  getRequiredSlotCount,
  getStartableSlots,
  getTotalDuration,
} from "@/lib/services";
import type { Barber, ServiceType, TimeSlot } from "@/lib/types";

interface BookingModalProps {
  readonly barber: Barber;
  readonly shopName: string;
  readonly services: readonly ServiceType[];
  readonly onClose: () => void;
}

export function BookingModal({
  barber,
  shopName,
  services,
  onClose,
}: BookingModalProps) {
  const days = useMemo(() => getUpcomingDays(), []);
  const [date, setDate] = useState(days[0]?.date ?? "");
  const [slots, setSlots] = useState<readonly TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<TimeSlot | null>(null);
  const [chosen, setChosen] = useState<readonly ServiceType[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const requiredCount = getRequiredSlotCount(chosen, barber.serviceDurations);
  const startable = useMemo(
    () => getStartableSlots(slots, requiredCount),
    [slots, requiredCount],
  );

  const toggleService = (service: ServiceType) => {
    setSelected(null);
    setChosen((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service],
    );
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (!date) return;
    let active = true;
    setLoading(true);
    setSelected(null);
    fetchSlots(barber.id, date)
      .then((result) => active && setSlots(result))
      .catch(() => active && setSlots([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [barber.id, date]);

  const handleSuccess = () => {
    setSuccess(selected ? formatDateTime(selected.startsAt) : "");
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === selected?.id ? { ...slot, status: "booked" } : slot,
      ),
    );
    setSelected(null);
  };

  const certificates = barber.certificates ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Փակել"
        onClick={onClose}
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Ամրագրում ${barber.firstName} ${barber.lastName}`}
        className="animate-slide-in relative flex h-full w-full flex-col overflow-y-auto border-l border-line bg-ink-soft shadow-2xl sm:w-[85%] md:w-[65%] lg:w-[58%]"
      >
        <ModalHeader barber={barber} shopName={shopName} onClose={onClose} />

        <div className="flex w-full flex-col gap-8 p-5 sm:p-8">
          {success ? (
            <SuccessState when={success} onClose={onClose} />
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted">Ընտրիր ծառայությունը</h3>
                  {chosen.length > 0 ? (
                    <span className="text-xs text-gold">
                      Տևողություն՝{" "}
                      {formatDuration(
                        getTotalDuration(chosen, barber.serviceDurations),
                      )}
                    </span>
                  ) : null}
                </div>
                <ServiceSelector
                  services={services}
                  selected={chosen}
                  durations={barber.serviceDurations}
                  onToggle={toggleService}
                />
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-muted">Ընտրիր օրը</h3>
                <DayPicker days={days} selected={date} onSelect={setDate} />
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-muted">Ազատ ժամեր</h3>
                {chosen.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted">
                    Նախ ընտրիր ծառայություն՝ ազատ ժամերը տեսնելու համար:
                  </p>
                ) : (
                  <SlotGrid
                    slots={startable}
                    selectedSlotId={selected?.id ?? null}
                    loading={loading}
                    onSelect={setSelected}
                  />
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-line pt-6">
                <h3 className="text-sm font-medium text-muted">Քո տվյալները</h3>
                <BookingForm
                  barberId={barber.id}
                  startsAt={selected?.startsAt ?? null}
                  services={chosen}
                  onSuccess={handleSuccess}
                />
              </div>
            </>
          )}

          {certificates.length > 0 ? (
            <CertificateList certificates={certificates} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface ModalHeaderProps {
  readonly barber: Barber;
  readonly shopName: string;
  readonly onClose: () => void;
}

function ModalHeader({ barber, shopName, onClose }: ModalHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-line bg-ink-soft/95 backdrop-blur">
      <div className="flex w-full items-center gap-4 p-5 sm:px-8">
        <div className="relative h-14 w-14 overflow-hidden rounded-xl">
          <Image
            src={barber.photoUrl}
            alt={`${barber.firstName} ${barber.lastName}`}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="font-display text-lg font-semibold">
            {barber.firstName} {barber.lastName}
          </p>
          <p className="text-xs text-muted">
            {shopName} · {barber.yearsExperience} տարվա փորձ
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Փակել"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted hover:text-gold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

interface SuccessStateProps {
  readonly when: string;
  readonly onClose: () => void;
}

function SuccessState({ when, onClose }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-3xl text-gold">
        ✓
      </div>
      <h3 className="font-display text-xl font-semibold">Ամրագրումը հաստատված է</h3>
      <p className="text-sm text-muted">{when}</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 rounded-full border border-gold/60 px-6 py-2.5 text-sm text-gold hover:bg-gold/10"
      >
        Փակել
      </button>
    </div>
  );
}
