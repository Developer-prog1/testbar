"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useDashboardAction } from "@/hooks/use-dashboard-action";

export interface MembershipInfo {
  readonly id: string;
  readonly shopName: string;
  readonly status: "pending" | "confirmed" | "rejected";
  readonly initiatedBy: "owner" | "barber";
}

export interface ShopOption {
  readonly id: string;
  readonly name: string;
}

interface ShopJoinProps {
  readonly memberships: readonly MembershipInfo[];
  readonly shops: readonly ShopOption[];
}

const STATUS_LABEL: Record<MembershipInfo["status"], string> = {
  pending: "Սպասում է հաստատման",
  confirmed: "Հաստատված",
  rejected: "Մերժված",
};

export function ShopJoin({ memberships, shops }: ShopJoinProps) {
  const { run, isPending } = useDashboardAction();
  const [items, setItems] = useState(memberships);
  const [shopId, setShopId] = useState("");

  useEffect(() => {
    setItems(memberships);
  }, [memberships]);

  const request = () => {
    if (!shopId) return;
    const selectedShop = shops.find((shop) => shop.id === shopId);
    if (!selectedShop) return;

    void run(`request-${shopId}`, {
      action: async () =>
        fetch("/api/dashboard/memberships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "request", shopId }),
        }),
      isSuccess: (response) => response.ok,
      onSuccess: () => {
        setShopId("");
      },
      refresh: true,
    });
  };

  const leave = (id: string) => {
    const previous = items;
    setItems((current) => current.filter((item) => item.id !== id));

    void run(`leave-${id}`, {
      action: async () =>
        fetch(`/api/dashboard/memberships/${id}`, { method: "DELETE" }),
      isSuccess: (response) => response.ok,
      onError: () => setItems(previous),
    });
  };

  const confirm = (id: string) => {
    const previous = items;
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "confirmed" as const } : item,
      ),
    );

    void run(`confirm-${id}`, {
      action: async () =>
        fetch(`/api/dashboard/memberships/${id}`, { method: "PATCH" }),
      isSuccess: (response) => response.ok,
      onError: () => setItems(previous),
    });
  };

  const joinedNames = new Set(items.map((item) => item.shopName));
  const available = shops.filter((shop) => !joinedNames.has(shop.name));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted">Դեռ կապված չես խանութի հետ:</p>
        ) : (
          items.map((membership) => (
            <div
              key={membership.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink-soft p-3"
            >
              <div>
                <p className="text-sm text-cream">{membership.shopName}</p>
                <p
                  className={cn(
                    "text-xs",
                    membership.status === "confirmed"
                      ? "text-green-400"
                      : "text-gold",
                  )}
                >
                  {STATUS_LABEL[membership.status]}
                </p>
              </div>
              <div className="flex gap-2">
                {membership.status === "pending" &&
                membership.initiatedBy === "owner" ? (
                  <Button
                    loading={isPending(`confirm-${membership.id}`)}
                    loadingLabel="..."
                    onClick={() => confirm(membership.id)}
                  >
                    Հաստատել
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  loading={isPending(`leave-${membership.id}`)}
                  loadingLabel="..."
                  onClick={() => leave(membership.id)}
                >
                  Հեռանալ
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5 text-sm">
          <span className="font-medium text-cream">Միանալ խանութի</span>
          <select
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            className="rounded-xl border border-line bg-ink-soft px-3 py-2 text-cream outline-none focus:border-gold"
          >
            <option value="">Ընտրիր խանութ</option>
            {available.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
        </label>
        <Button
          onClick={request}
          disabled={!shopId}
          loading={Boolean(shopId && isPending(`request-${shopId}`))}
          loadingLabel="Ուղարկվում է..."
        >
          Հայտ ուղարկել
        </Button>
      </div>
    </div>
  );
}
