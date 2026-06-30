"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useState } from "react";
import { DeleteRowButton } from "@/components/admin/DeleteRowButton";
import { Button } from "@/components/ui/Button";
import type { HeroSlideRow } from "@/lib/types";

interface HeroManagerProps {
  readonly slides: readonly HeroSlideRow[];
}

async function uploadImage(file: File): Promise<string | null> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body: form });
  if (!res.ok) return null;
  const data = (await res.json()) as { id: string };
  return data.id;
}

export function HeroManager({ slides }: HeroManagerProps) {
  const router = useRouter();
  const addInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => router.refresh();

  const handleReplace = async (slideId: string, file: File) => {
    setError(null);
    setBusy(true);
    const imageId = await uploadImage(file);
    if (!imageId) {
      setBusy(false);
      setError("Չհաջողվեց վերբեռնել (max 4MB, image):");
      return;
    }
    const res = await fetch(`/api/admin/hero/${slideId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    });
    setBusy(false);
    if (res.ok) refresh();
    else setError("Չհաջողվեց թարմացնել նկարը:");
  };

  const handleAdd = async (file: File) => {
    setError(null);
    setBusy(true);
    const imageId = await uploadImage(file);
    if (!imageId) {
      setBusy(false);
      setError("Չհաջողվեց վերբեռնել (max 4MB, image):");
      return;
    }
    const res = await fetch("/api/admin/hero", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    });
    setBusy(false);
    if (res.ok) refresh();
    else setError("Չհաջողվեց ավելացնել slide:");
  };

  return (
    <div className="flex flex-col gap-6">
      {slides.length === 0 ? (
        <p className="text-sm text-muted">
          Hero slide-եր դեռ չկան — ավելացրու նկար:
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {slides.map((slide, index) => (
            <HeroSlideCard
              key={slide.id}
              slide={slide}
              index={index}
              disabled={busy}
              onReplace={(file) => handleReplace(slide.id, file)}
              onDelete={refresh}
            />
          ))}
        </ul>
      )}

      <div>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => addInputRef.current?.click()}
        >
          {busy ? "Պատրաստվում է..." : "+ Ավելացնել նկար"}
        </Button>
        <input
          ref={addInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleAdd(file);
            event.target.value = "";
          }}
        />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

interface HeroSlideCardProps {
  readonly slide: HeroSlideRow;
  readonly index: number;
  readonly disabled: boolean;
  readonly onReplace: (file: File) => void;
  readonly onDelete: () => void;
}

function HeroSlideCard({
  slide,
  index,
  disabled,
  onReplace,
  onDelete,
}: HeroSlideCardProps) {
  const replaceRef = useRef<HTMLInputElement>(null);

  return (
    <li className="flex flex-col gap-3 rounded-card border border-line bg-panel p-4">
      <div className="relative aspect-[16/7] overflow-hidden rounded-lg">
        <Image
          src={slide.imageUrl}
          alt={`Hero ${index + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted">Slide {index + 1}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => replaceRef.current?.click()}
            className="text-xs text-gold hover:underline disabled:opacity-50"
          >
            Փոխել
          </button>
          <input
            ref={replaceRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onReplace(file);
              event.target.value = "";
            }}
          />
          <DeleteRowButton
            endpoint={`/api/admin/hero/${slide.id}`}
            label={`Slide ${index + 1}`}
            onChanged={onDelete}
          />
        </div>
      </div>
    </li>
  );
}
