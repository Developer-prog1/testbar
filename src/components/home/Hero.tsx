"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import {
  HERO_ROTATE_INTERVAL_MS,
  SITE_TAGLINE,
} from "@/lib/constants";

interface HeroProps {
  readonly images: readonly string[];
}

export function Hero({ images }: HeroProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setActive((index) => (index + 1) % images.length);
    }, HERO_ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {images.map((src, index) => (
          <Image
            key={`${src}-${index}`}
            src={src}
            alt="Barber shop"
            fill
            priority={index === 0}
            sizes="100vw"
            className={cn(
              "object-cover transition-opacity duration-1000",
              index === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      </div>

      <Container className="flex min-h-[78vh] flex-col justify-center gap-6 py-20 sm:min-h-[80vh]">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold sm:text-sm">
          Premium Barber Experience
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Քո ոճը՝ <span className="text-gold">վարպետի</span> ձեռքերում
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
          {SITE_TAGLINE}. Ընտրիր խանութը, վարպետին և ամրագրիր ազատ ժամը մի քանի
          քայլով:
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/products" size="lg">
            Դեպի խանութներ
          </Button>
          <Button href="/contact" size="lg" variant="outline">
            Կապ հաստատել
          </Button>
        </div>

        {images.length > 1 ? (
          <div className="flex gap-2" role="tablist" aria-label="Hero carousel">
            {images.map((src, index) => (
              <button
                key={`dot-${src}-${index}`}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Նկար ${index + 1}`}
                onClick={() => setActive(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === active ? "w-8 bg-gold" : "w-4 bg-cream/40",
                )}
              />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
