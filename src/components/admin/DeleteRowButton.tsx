"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteRowButtonProps {
  readonly endpoint: string;
  readonly label: string;
  readonly onChanged?: () => void;
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function DeleteRowButton({
  endpoint,
  label,
  onChanged,
}: DeleteRowButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    setBusy(true);
    onChanged?.();
    setConfirming(false);

    const res = await fetch(endpoint, { method: "DELETE" });
    setBusy(false);

    if (res.ok) {
      router.refresh();
      return;
    }

    router.refresh();
  };

  if (confirming) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="rounded-md bg-red-500/90 px-2 py-1 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
        >
          {busy ? "..." : "Այո"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={busy}
          className="rounded-md border border-line px-2 py-1 text-xs text-muted hover:text-cream"
        >
          Չեղ.
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Ջնջել «${label}»`}
      title={`Ջնջել «${label}»`}
      onClick={() => setConfirming(true)}
      className="shrink-0 text-muted transition-colors hover:text-red-400"
    >
      <TrashIcon />
    </button>
  );
}
