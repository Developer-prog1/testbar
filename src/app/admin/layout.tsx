import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { NavItem } from "@/components/dashboard/Sidebar";

const ADMIN_NAV: readonly NavItem[] = [
  { href: "/admin/shops", label: "Խանութներ" },
  { href: "/admin/barbers", label: "Վարսավիրներ" },
  { href: "/admin/messages", label: "Հաղորդագրություններ" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/account", label: "Հաշիվ" },
];

export default async function AdminLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/login");

  return (
    <DashboardShell title="Ադմին" subtitle={user.email} items={ADMIN_NAV}>
      {children}
    </DashboardShell>
  );
}
