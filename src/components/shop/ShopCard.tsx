import Image from "next/image";
import Link from "next/link";
import { Rating } from "@/components/ui/Rating";
import { ServiceBadge } from "@/components/ui/ServiceBadge";
import type { BarberShop } from "@/lib/types";

interface ShopCardProps {
  readonly shop: BarberShop;
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link
      href={`/products/${shop.id}`}
      prefetch
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-panel transition-colors hover:border-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={shop.imageUrl}
          alt={shop.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="rounded-full bg-ink/70 px-2.5 py-1 text-xs text-cream">
            {shop.district}
          </span>
          <Rating value={shop.rating} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-lg font-semibold group-hover:text-gold">
            {shop.name}
          </h3>
          <p className="text-sm text-muted">{shop.address}</p>
        </div>
        <p className="line-clamp-2 text-sm text-muted/90">{shop.description}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {shop.services.map((service) => (
            <ServiceBadge key={service} service={service} />
          ))}
        </div>
      </div>
    </Link>
  );
}
