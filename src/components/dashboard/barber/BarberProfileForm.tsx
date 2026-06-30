"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { useDashboardAction } from "@/hooks/use-dashboard-action";

export interface BarberProfileDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly specialty: string;
  readonly yearsExperience: number;
  readonly photoId: string | null;
  readonly photoSrc: string | null;
}

const SAVE_KEY = "barber-profile";

export function BarberProfileForm({
  profile,
}: {
  readonly profile: BarberProfileDto;
}) {
  const { run, isPending } = useDashboardAction();
  const [form, setForm] = useState(profile);

  const set = <K extends keyof BarberProfileDto>(
    key: K,
    value: BarberProfileDto[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void run(SAVE_KEY, {
      action: async () =>
        fetch("/api/dashboard/barber", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            specialty: form.specialty,
            yearsExperience: form.yearsExperience,
            photoId: form.photoId,
          }),
        }),
      isSuccess: (response) => response.ok,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <ImageUploader
        label="Պրոֆիլի նկար"
        currentSrc={form.photoSrc}
        onUploaded={(id) => set("photoId", id)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="firstName"
          label="Անուն"
          value={form.firstName}
          onChange={(e) => set("firstName", e.target.value)}
        />
        <TextField
          id="lastName"
          label="Ազգանուն"
          value={form.lastName}
          onChange={(e) => set("lastName", e.target.value)}
        />
        <TextField
          id="specialty"
          label="Մասնագիտացում"
          value={form.specialty}
          onChange={(e) => set("specialty", e.target.value)}
        />
        <TextField
          id="years"
          label="Փորձ (տարի)"
          type="number"
          value={form.yearsExperience.toString()}
          onChange={(e) => set("yearsExperience", Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <Button
          type="submit"
          loading={isPending(SAVE_KEY)}
          loadingLabel="Պահպանում..."
        >
          Պահպանել
        </Button>
      </div>
    </form>
  );
}
