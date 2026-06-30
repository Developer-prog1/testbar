"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import type { EntityStatus } from "@/lib/types";

interface StatusToggleProps {
  readonly endpoint: string;
  readonly status: EntityStatus;
  readonly onChanged?: () => void;
}

const LABELS: Readonly<Record<EntityStatus, string>> = {
  active: "Ակտիվ",
  draft: "Draft",
};

export function StatusToggle({ endpoint, status, onChanged }: StatusToggleProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const next: EntityStatus = status === "active" ? "draft" : "active";

  const handleClick = async () => {
    setBusy(true);
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (res.ok) {
      router.refresh();
      onChanged?.();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      title={`Դարձնել «${LABELS[next]}»`}
      className={cn(
        "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50",
        status === "active"
          ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
          : "bg-line/50 text-muted hover:bg-line/70",
      )}
    >
      {LABELS[status]}
    </button>
  );
}
