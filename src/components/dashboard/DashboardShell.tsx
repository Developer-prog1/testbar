import type { ReactNode } from "react";
import { Sidebar, type NavItem } from "@/components/dashboard/Sidebar";
import { LogoutButton } from "@/components/dashboard/LogoutButton";

interface DashboardShellProps {
  readonly title: string;
  readonly subtitle: string;
  readonly items: readonly NavItem[];
  readonly children: ReactNode;
}

export function DashboardShell({
  title,
  subtitle,
  items,
  children,
}: DashboardShellProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:py-12">
      <Sidebar title={title} subtitle={subtitle} items={items} />
      <main className="min-w-0 flex-1">{children}</main>
      <div className="lg:hidden">
        <LogoutButton />
      </div>
    </div>
  );
}
