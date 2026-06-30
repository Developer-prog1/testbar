"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ImageUploader } from "@/components/dashboard/ImageUploader";

export interface BarberProfileDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly specialty: string;
  readonly yearsExperience: number;
  readonly photoId: string | null;
  readonly photoSrc: string | null;
}

export function BarberProfileForm({
  profile,
}: {
  readonly profile: BarberProfileDto;
}) {
  const router = useRouter();
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof BarberProfileDto>(
    key: K,
    value: BarberProfileDto[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    await fetch("/api/dashboard/barber", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        specialty: form.specialty,
        yearsExperience: form.yearsExperience,
        photoId: form.photoId,
      }),
    });
    setSaving(false);
    router.refresh();
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
        <Button type="submit" disabled={saving}>
          {saving ? "Պահպանում..." : "Պահպանել"}
        </Button>
      </div>
    </form>
  );
}
