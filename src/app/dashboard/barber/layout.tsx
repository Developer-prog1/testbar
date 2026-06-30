import type { ReactNode } from "react";
import { BarberDashboardShell } from "@/components/dashboard/barber/BarberDashboardShell";
import type { NavItem } from "@/components/dashboard/Sidebar";

const BARBER_NAV: readonly NavItem[] = [
  { href: "/dashboard/barber", label: "Ամրագրումներ" },
  { href: "/dashboard/barber/schedule", label: "Գրաֆիկ" },
  { href: "/dashboard/barber/profile", label: "Իմ էջը" },
  { href: "/dashboard/barber/account", label: "Հաշիվ" },
];

export default function BarberLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <BarberDashboardShell items={BARBER_NAV}>{children}</BarberDashboardShell>
  );
}
