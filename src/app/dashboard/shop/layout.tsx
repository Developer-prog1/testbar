import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { NavItem } from "@/components/dashboard/Sidebar";

const OWNER_NAV: readonly NavItem[] = [
  { href: "/dashboard/shop", label: "Իմ խանութը" },
  { href: "/dashboard/shop/barbers", label: "Վարսավիրներ" },
  { href: "/dashboard/shop/settings", label: "Կարգավորումներ" },
];

export default async function OwnerLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const user = await getCurrentUser();
  const subtitle = user?.shop?.name ?? user?.email ?? "";

  return (
    <DashboardShell title="Խանութ" subtitle={subtitle} items={OWNER_NAV}>
      {children}
    </DashboardShell>
  );
}
