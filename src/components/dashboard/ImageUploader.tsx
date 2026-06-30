"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface ImageUploaderProps {
  readonly label: string;
  readonly currentSrc?: string | null;
  readonly aspect?: "square" | "wide";
  readonly onUploaded: (imageId: string) => void;
}

export function ImageUploader({
  label,
  currentSrc,
  aspect = "square",
  onUploaded,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentSrc ?? null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/uploads", { method: "POST", body: form });
    setUploading(false);

    if (!res.ok) {
      setError("Չհաջողվեց վերբեռնել (max 4MB, image):");
      return;
    }
    const data = (await res.json()) as { id: string };
    setPreview(`/api/images/${data.id}`);
    onUploaded(data.id);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative overflow-hidden rounded-xl border border-dashed border-line bg-ink-soft transition-colors hover:border-gold/60",
          aspect === "square" ? "aspect-square w-32" : "aspect-[16/7] w-full",
        )}
      >
        {preview ? (
          <Image src={preview} alt={label} fill className="object-cover" sizes="320px" />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-muted">
            {uploading ? "Վերբեռնում..." : "Ընտրել նկար"}
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}
