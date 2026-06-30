import type { ServiceType, TimeSlot } from "@/lib/types";

export async function fetchSlots(
  barberId: string,
  date: string,
): Promise<readonly TimeSlot[]> {
  const res = await fetch(`/api/barbers/${barberId}/slots?date=${date}`);
  if (!res.ok) throw new Error("Չհաջողվեց բեռնել ժամերը");
  const data = (await res.json()) as { slots: readonly TimeSlot[] };
  return data.slots;
}

export interface SubmitBookingInput {
  readonly barberId: string;
  readonly startsAt: string;
  readonly services: readonly ServiceType[];
  readonly clientFirstName: string;
  readonly clientLastName: string;
  readonly clientPhone: string;
}

export type SubmitBookingResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly message: string };

export async function submitBooking(
  input: SubmitBookingInput,
): Promise<SubmitBookingResult> {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (res.ok) return { ok: true };

  if (res.status === 409) {
    return { ok: false, message: "Այս ժամն արդեն զբաղված է: Ընտրեք այլ ժամ:" };
  }
  if (res.status === 422) {
    return { ok: false, message: "Ստուգեք լրացված տվյալները:" };
  }
  return { ok: false, message: "Սխալ տեղի ունեցավ: Կրկին փորձեք:" };
}
