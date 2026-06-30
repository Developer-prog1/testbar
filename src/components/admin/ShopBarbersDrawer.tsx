"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminBarbersTable } from "@/components/admin/AdminBarbersTable";
import type { AdminBarberRow } from "@/lib/types";

interface ShopBarbersDrawerProps {
  readonly shopId: string;
  readonly shopName: string;
  readonly onClose: () => void;
}

export function ShopBarbersDrawer({
  shopId,
  shopName,
  onClose,
}: ShopBarbersDrawerProps) {
  const [barbers, setBarbers] = useState<readonly AdminBarberRow[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      const res = await fetch(`/api/admin/shops/${shopId}/barbers`);
      if (!res.ok) throw new Error("request_failed");
      const data = (await res.json()) as { barbers: AdminBarberRow[] };
      setBarbers(data.barbers);
    } catch {
      setError(true);
    }
  }, [shopId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Փակել"
        onClick={onClose}
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${shopName} — վարսավիրներ`}
        className="animate-slide-in relative flex h-full w-full flex-col overflow-y-auto border-l border-line bg-ink-soft shadow-2xl sm:w-[80%] md:w-[60%]"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-ink-soft/95 p-5 backdrop-blur sm:px-8">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold">
              {shopName}
            </p>
            <p className="text-xs text-muted">Վարսավիրներ</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Փակել"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-muted hover:text-gold"
          >
            ✕
          </button>
        </header>

        <div className="p-5 sm:p-8">
          {error ? (
            <p className="text-sm text-red-400">Չհաջողվեց բեռնել վարսավիրներին:</p>
          ) : barbers === null ? (
            <p className="text-sm text-muted">Բեռնում...</p>
          ) : (
            <AdminBarbersTable barbers={barbers} onChanged={load} />
          )}
        </div>
      </div>
    </div>
  );
}
