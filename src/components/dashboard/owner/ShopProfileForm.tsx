"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { ServiceChips } from "@/components/dashboard/ServiceChips";
import type { ServiceType } from "@/lib/types";

export interface ShopDto {
  readonly name: string;
  readonly description: string;
  readonly district: string;
  readonly address: string;
  readonly lat: number | null;
  readonly lng: number | null;
  readonly services: ServiceType[];
  readonly imageId: string | null;
  readonly coverImageId: string | null;
  readonly imageSrc: string | null;
  readonly coverSrc: string | null;
}

const toNumberOrNull = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

export function ShopProfileForm({ shop }: { readonly shop: ShopDto }) {
  const router = useRouter();
  const [form, setForm] = useState(shop);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  const set = <K extends keyof ShopDto>(key: K, value: ShopDto[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleService = (service: ServiceType) =>
    set(
      "services",
      form.services.includes(service)
        ? form.services.filter((item) => item !== service)
        : [...form.services, service],
    );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/dashboard/shop", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        district: form.district,
        address: form.address,
        lat: form.lat,
        lng: form.lng,
        services: form.services,
        imageId: form.imageId,
        coverImageId: form.coverImageId,
      }),
    });
    setStatus(res.ok ? "saved" : "error");
    if (res.ok) router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUploader
          label="Քարտի նկար (/products)"
          currentSrc={form.imageSrc}
          onUploaded={(id) => set("imageId", id)}
        />
        <ImageUploader
          label="Շապիկի նկար"
          aspect="wide"
          currentSrc={form.coverSrc}
          onUploaded={(id) => set("coverImageId", id)}
        />
      </div>

      <TextField
        id="name"
        label="Անվանում"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
      />

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-cream">Նկարագրություն</span>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="rounded-xl border border-line bg-ink-soft px-3 py-2 text-cream outline-none focus:border-gold"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="district"
          label="Թաղամաս"
          value={form.district}
          onChange={(e) => set("district", e.target.value)}
        />
        <TextField
          id="address"
          label="Հասցե"
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
        />
        <TextField
          id="lat"
          label="Լայնություն (lat)"
          value={form.lat?.toString() ?? ""}
          onChange={(e) => set("lat", toNumberOrNull(e.target.value))}
        />
        <TextField
          id="lng"
          label="Երկայնություն (lng)"
          value={form.lng?.toString() ?? ""}
          onChange={(e) => set("lng", toNumberOrNull(e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-cream">Ծառայություններ</span>
        <ServiceChips selected={form.services} onToggle={toggleService} />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Պահպանում..." : "Պահպանել"}
        </Button>
        {status === "saved" ? (
          <span className="text-sm text-green-400">Պահպանված է:</span>
        ) : null}
        {status === "error" ? (
          <span className="text-sm text-red-400">Սխալ:</span>
        ) : null}
      </div>
    </form>
  );
}
