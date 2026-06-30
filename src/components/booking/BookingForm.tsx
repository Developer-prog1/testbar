"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { submitBooking } from "@/lib/api-client";
import { bookingSchema } from "@/lib/validation";
import type { ServiceType } from "@/lib/types";

interface BookingFormProps {
  readonly barberId: string;
  readonly startsAt: string | null;
  readonly services: readonly ServiceType[];
  readonly onSuccess: () => void;
}

interface FieldState {
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
}

const EMPTY: FieldState = { firstName: "", lastName: "", phone: "" };

export function BookingForm({
  barberId,
  startsAt,
  services,
  onSuccess,
}: BookingFormProps) {
  const [fields, setFields] = useState<FieldState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key: keyof FieldState, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!startsAt) return;

    const payload = {
      barberId,
      startsAt,
      services,
      clientFirstName: fields.firstName,
      clientLastName: fields.lastName,
      clientPhone: fields.phone,
    };

    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) {
      setError("Լրացրու բոլոր դաշտերը ճիշտ ֆորմատով (հեռ.՝ +374XXXXXXXX):");
      return;
    }

    setError(null);
    setSubmitting(true);
    const result = await submitBooking(parsed.data);
    setSubmitting(false);

    if (result.ok) {
      setFields(EMPTY);
      onSuccess();
      return;
    }
    setError(result.message);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <TextField
        id="firstName"
        label="Անուն"
        value={fields.firstName}
        onChange={(event) => setField("firstName", event.target.value)}
        autoComplete="given-name"
      />
      <TextField
        id="lastName"
        label="Ազգանուն"
        value={fields.lastName}
        onChange={(event) => setField("lastName", event.target.value)}
        autoComplete="family-name"
      />
      <TextField
        id="phone"
        label="Հեռախոսահամար"
        value={fields.phone}
        onChange={(event) => setField("phone", event.target.value)}
        placeholder="+37491234567"
        inputMode="tel"
        autoComplete="tel"
      />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Button
        type="submit"
        size="lg"
        disabled={!startsAt || services.length === 0 || submitting}
        className="mt-2"
      >
        {submitting ? "Ամրագրվում է..." : "Ամրագրել"}
      </Button>
      {services.length === 0 ? (
        <p className="text-center text-xs text-muted">Նախ ընտրիր ծառայություն:</p>
      ) : !startsAt ? (
        <p className="text-center text-xs text-muted">Նախ ընտրիր ազատ ժամ:</p>
      ) : null}
    </form>
  );
}
