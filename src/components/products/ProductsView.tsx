"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ShopFilters } from "@/components/products/ShopFilters";
import { ShopCard } from "@/components/shop/ShopCard";
import { asServiceType, filterShops } from "@/lib/shop-filters";
import type { BarberShop } from "@/lib/types";

interface ProductsViewProps {
  readonly shops: readonly BarberShop[];
  readonly districts: readonly string[];
}

export function ProductsView({ shops, districts }: ProductsViewProps) {
  const params = useSearchParams();

  const filtered = useMemo(
    () =>
      filterShops(shops, {
        district: params.get("district") ?? undefined,
        service: asServiceType(params.get("service") ?? undefined),
        search: params.get("search") ?? undefined,
      }),
    [params, shops],
  );

  return (
    <>
      <ShopFilters districts={districts} />

      {filtered.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-panel p-12 text-center">
          <p className="text-cream">Արդյունք չի գտնվել:</p>
          <p className="mt-1 text-sm text-muted">Փորձիր փոխել ֆիլտրերը:</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </>
  );
}
