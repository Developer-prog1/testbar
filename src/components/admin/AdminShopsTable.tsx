"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDateTimeFull } from "@/lib/datetime";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { DeleteRowButton } from "@/components/admin/DeleteRowButton";
import { ShopBarbersDrawer } from "@/components/admin/ShopBarbersDrawer";
import type { AdminShopRow } from "@/lib/types";

interface AdminShopsTableProps {
  readonly shops: readonly AdminShopRow[];
}

export function AdminShopsTable({ shops }: AdminShopsTableProps) {
  const [active, setActive] = useState<AdminShopRow | null>(null);

  if (shops.length === 0) {
    return <p className="text-sm text-muted">Խանութներ դեռ չկան:</p>;
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {shops.map((shop) => {
          const location = [shop.district, shop.address]
            .filter(Boolean)
            .join(" · ");
          const endpoint = `/api/admin/shops/${shop.id}`;
          return (
            <li
              key={shop.id}
              className="flex items-center gap-3 rounded-card border border-line bg-panel p-3 transition-colors hover:border-gold/40 sm:gap-4"
            >
              <button
                type="button"
                onClick={() => setActive(shop)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={shop.imageUrl}
                    alt={shop.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-cream">{shop.name}</p>
                  <p className="truncate text-xs text-muted">{location || "—"}</p>
                  <p className="text-xs text-muted">
                    {formatDateTimeFull(shop.createdAt)}
                  </p>
                </div>
              </button>
              <StatusToggle endpoint={endpoint} status={shop.status} />
              <DeleteRowButton endpoint={endpoint} label={shop.name} />
            </li>
          );
        })}
      </ul>

      {active ? (
        <ShopBarbersDrawer
          shopId={active.id}
          shopName={active.name}
          onClose={() => setActive(null)}
        />
      ) : null}
    </>
  );
}
