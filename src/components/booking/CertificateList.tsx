import Image from "next/image";
import type { Certificate } from "@/lib/types";

interface CertificateListProps {
  readonly certificates: readonly Certificate[];
}

export function CertificateList({ certificates }: CertificateListProps) {
  return (
    <section className="border-t border-line pt-6">
      <h3 className="font-display text-lg font-semibold">
        Սերտիֆիկատներ
        <span className="ml-2 text-sm font-normal text-muted">
          ({certificates.length})
        </span>
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {certificates.map((cert) => (
          <figure
            key={cert.id}
            className="overflow-hidden rounded-card border border-line bg-panel"
          >
            <div className="relative aspect-[10/7]">
              <Image
                src={cert.imageUrl}
                alt={cert.title}
                fill
                sizes="(max-width: 640px) 100vw, 360px"
                className="object-cover"
              />
            </div>
            <figcaption className="flex flex-col gap-1 p-4">
              <span className="font-medium text-cream">{cert.title}</span>
              <span className="text-xs text-muted">
                {cert.issuer} · {cert.year}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
