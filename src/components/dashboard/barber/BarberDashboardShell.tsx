"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { NavItem } from "@/components/dashboard/Sidebar";

interface BarberDashboardShellProps {
  readonly items: readonly NavItem[];
  readonly children: ReactNode;
}

export function BarberDashboardShell({
  items,
  children,
}: BarberDashboardShellProps) {
  const router = useRouter();
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    for (const item of items) {
      router.prefetch(item.href);
    }
  }, [items, router]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/session")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { displayName?: string; email?: string } | null) => {
        if (cancelled || !data) return;
        setSubtitle(data.displayName || data.email || "");
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardShell title="Վարսավիր" subtitle={subtitle} items={items}>
      {children}
    </DashboardShell>
  );
}
