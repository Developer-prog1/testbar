"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

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
  const router = useRouter();
  const [shopId, setShopId] = useState("");

  const request = async () => {
    if (!shopId) return;
    const res = await fetch("/api/dashboard/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "request", shopId }),
    });
    if (res.ok) {
      setShopId("");
      router.refresh();
    }
  };

  const leave = async (id: string) => {
    const res = await fetch(`/api/dashboard/memberships/${id}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  };

  const confirm = async (id: string) => {
    const res = await fetch(`/api/dashboard/memberships/${id}`, {
      method: "PATCH",
    });
    if (res.ok) router.refresh();
  };

  const joinedIds = new Set(memberships.map((m) => m.shopName));
  const available = shops.filter((s) => !joinedIds.has(s.name));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {memberships.length === 0 ? (
          <p className="text-sm text-muted">Դեռ կապված չես խանութի հետ:</p>
        ) : (
          memberships.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink-soft p-3"
            >
              <div>
                <p className="text-sm text-cream">{m.shopName}</p>
                <p
                  className={cn(
                    "text-xs",
                    m.status === "confirmed" ? "text-green-400" : "text-gold",
                  )}
                >
                  {STATUS_LABEL[m.status]}
                </p>
              </div>
              <div className="flex gap-2">
                {m.status === "pending" && m.initiatedBy === "owner" ? (
                  <Button onClick={() => confirm(m.id)}>Հաստատել</Button>
                ) : null}
                <Button variant="ghost" onClick={() => leave(m.id)}>
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
        <Button onClick={request} disabled={!shopId}>
          Հայտ ուղարկել
        </Button>
      </div>
    </div>
  );
}
