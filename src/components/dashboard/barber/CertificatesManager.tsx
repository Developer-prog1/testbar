"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { useDashboardAction } from "@/hooks/use-dashboard-action";

export interface CertificateDto {
  readonly id: string;
  readonly title: string;
  readonly issuer: string;
  readonly year: number;
  readonly imageSrc: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const ADD_KEY = "certificate-add";

export function CertificatesManager({
  certificates,
}: {
  readonly certificates: readonly CertificateDto[];
}) {
  const { run, isPending } = useDashboardAction();
  const [items, setItems] = useState(certificates);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [imageId, setImageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(certificates);
  }, [certificates]);

  const add = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    void run(ADD_KEY, {
      action: async () =>
        fetch("/api/dashboard/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, issuer, year, imageId }),
        }),
      isSuccess: (response) => response.ok,
      onSuccess: async (response) => {
        const data = (await response.json()) as {
          certificate: {
            id: string;
            title: string;
            issuer: string;
            year: number;
            imageId: string | null;
          };
        };
        const created: CertificateDto = {
          id: data.certificate.id,
          title: data.certificate.title,
          issuer: data.certificate.issuer,
          year: data.certificate.year,
          imageSrc: data.certificate.imageId
            ? `/api/images/${data.certificate.imageId}`
            : "",
        };
        setItems((current) => [created, ...current]);
        setTitle("");
        setIssuer("");
        setImageId(null);
      },
      onError: () => setError("Ստուգիր դաշտերը:"),
    });
  };

  const remove = (id: string) => {
    const previous = items;
    setItems((current) => current.filter((item) => item.id !== id));

    void run(`certificate-${id}`, {
      action: async () =>
        fetch(`/api/dashboard/certificates/${id}`, { method: "DELETE" }),
      isSuccess: (response) => response.ok,
      onError: () => setItems(previous),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((cert) => (
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
                  disabled={isPending(`certificate-${cert.id}`)}
                  className="mt-1 text-xs text-red-400 hover:underline disabled:opacity-50"
                >
                  {isPending(`certificate-${cert.id}`) ? "..." : "Հեռացնել"}
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
          <Button
            type="submit"
            loading={isPending(ADD_KEY)}
            loadingLabel="Ավելացվում է..."
          >
            Ավելացնել սերտիֆիկատ
          </Button>
        </div>
      </form>
    </div>
  );
}
