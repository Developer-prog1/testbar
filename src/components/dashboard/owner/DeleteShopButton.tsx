"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function DeleteShopButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/shop", { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard/shop");
      router.refresh();
    }
  };

  if (!confirming) {
    return (
      <Button variant="ghost" onClick={() => setConfirming(true)}>
        Ջնջել խանութը
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-red-400">Վստա՞հ ես: Անվերադարձ է:</span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
      >
        {loading ? "Ջնջում..." : "Այո, ջնջել"}
      </button>
      <Button variant="ghost" onClick={() => setConfirming(false)}>
        Չեղարկել
      </Button>
    </div>
  );
}
