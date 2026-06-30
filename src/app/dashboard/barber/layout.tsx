import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { NavItem } from "@/components/dashboard/Sidebar";

const BARBER_NAV: readonly NavItem[] = [
  { href: "/dashboard/barber", label: "Ամրագրումներ" },
  { href: "/dashboard/barber/schedule", label: "Գրաֆիկ" },
  { href: "/dashboard/barber/profile", label: "Իմ էջը" },
  { href: "/dashboard/barber/account", label: "Հաշիվ" },
];

export default async function BarberLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const user = await getCurrentUser();
  const name = user?.barber
    ? `${user.barber.firstName} ${user.barber.lastName}`.trim()
    : "";

  return (
    <DashboardShell
      title="Վարսավիր"
      subtitle={name || user?.email || ""}
      items={BARBER_NAV}
    >
      {children}
    </DashboardShell>
  );
}
