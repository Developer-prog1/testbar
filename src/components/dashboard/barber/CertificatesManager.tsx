"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ImageUploader } from "@/components/dashboard/ImageUploader";

export interface CertificateDto {
  readonly id: string;
  readonly title: string;
  readonly issuer: string;
  readonly year: number;
  readonly imageSrc: string;
}

const CURRENT_YEAR = new Date().getFullYear();

export function CertificatesManager({
  certificates,
}: {
  readonly certificates: readonly CertificateDto[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [imageId, setImageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const res = await fetch("/api/dashboard/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, issuer, year, imageId }),
    });
    if (!res.ok) return setError("Ստուգիր դաշտերը:");
    setTitle("");
    setIssuer("");
    setImageId(null);
    router.refresh();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/dashboard/certificates/${id}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  };

  return (
    <div className="flex flex-col gap-5">
      {certificates.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex gap-3 rounded-xl border border-line bg-ink-soft p-3"
            >
              <Image
                src={cert.imageSrc}
                alt={cert.title}
                width={64}
                height={48}
                className="h-12 w-16 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-cream">{cert.title}</p>
                <p className="truncate text-xs text-muted">
                  {cert.issuer} · {cert.year}
                </p>
                <button
                  type="button"
                  onClick={() => remove(cert.id)}
                  className="mt-1 text-xs text-red-400 hover:underline"
                >
                  Հեռացնել
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Սերտիֆիկատներ դեռ չկան:</p>
      )}

      <form onSubmit={add} className="flex flex-col gap-4 border-t border-line pt-5">
        <ImageUploader
          label="Սերտիֆիկատի նկար"
          aspect="wide"
          currentSrc={imageId ? `/api/images/${imageId}` : null}
          onUploaded={setImageId}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            id="cert-title"
            label="Անվանում"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            id="cert-issuer"
            label="Տվող կազմակերպություն"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
          />
          <TextField
            id="cert-year"
            label="Տարի"
            type="number"
            value={year.toString()}
            onChange={(e) => setYear(Number(e.target.value) || CURRENT_YEAR)}
          />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div>
          <Button type="submit">Ավելացնել սերտիֆիկատ</Button>
        </div>
      </form>
    </div>
  );
}
