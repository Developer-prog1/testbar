"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ALL_SERVICES, SERVICE_LABELS } from "@/lib/constants";

interface ShopFiltersProps {
  readonly districts: readonly string[];
}

const SELECT_CLASS =
  "w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

export function ShopFilters({ districts }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const hasFilters = params.toString().length > 0;

  return (
    <div className="grid gap-4 rounded-card border border-line bg-panel p-5 sm:grid-cols-2 lg:grid-cols-4">
      <input
        type="search"
        value={params.get("search") ?? ""}
        placeholder="Որոնել խանութ..."
        aria-label="Որոնում"
        onChange={(event) => updateParam("search", event.target.value)}
        className={SELECT_CLASS}
      />

      <select
        value={params.get("district") ?? ""}
        aria-label="Թաղամաս"
        onChange={(event) => updateParam("district", event.target.value)}
        className={SELECT_CLASS}
      >
        <option value="">Բոլոր թաղամասերը</option>
        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>

      <select
        value={params.get("service") ?? ""}
        aria-label="Ծառայություն"
        onChange={(event) => updateParam("service", event.target.value)}
        className={SELECT_CLASS}
      >
        <option value="">Բոլոր ծառայությունները</option>
        {ALL_SERVICES.map((service) => (
          <option key={service} value={service}>
            {SERVICE_LABELS[service]}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={!hasFilters}
        onClick={() => router.replace(pathname, { scroll: false })}
        className="rounded-xl border border-line px-4 py-3 text-sm text-muted transition-colors hover:border-gold/60 hover:text-gold disabled:opacity-40"
      >
        Մաքրել ֆիլտրերը
      </button>
    </div>
  );
}
