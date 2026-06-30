import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Rating } from "@/components/ui/Rating";
import { ServiceBadge } from "@/components/ui/ServiceBadge";
import type { BarberShop } from "@/lib/types";

interface ShopHeaderProps {
  readonly shop: BarberShop;
}

export function ShopHeader({ shop }: ShopHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line/70">
      <div className="absolute inset-0 -z-10">
        <Image
          src={shop.coverImageUrl}
          alt={shop.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
      </div>

      <Container className="flex flex-col gap-4 pb-10 pt-24 sm:pt-28">
        <Link href="/products" className="text-sm text-muted hover:text-gold">
          ← Բոլոր խանութները
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            {shop.name}
          </h1>
          <Rating value={shop.rating} />
        </div>
        <p className="text-sm text-cream/80">
          {shop.address} · {shop.district}
        </p>
        <p className="max-w-2xl text-sm text-muted">{shop.description}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {shop.services.map((service) => (
            <ServiceBadge key={service} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
