"use client";

import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { NavLink } from "@/components/navigation/NavLink";
import { cn } from "@/lib/cn";

export interface NavItem {
  readonly href: string;
  readonly label: string;
}

interface SidebarProps {
  readonly title: string;
  readonly subtitle: string;
  readonly items: readonly NavItem[];
}

export function Sidebar({ title, subtitle, items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col gap-4 lg:w-60 lg:shrink-0">
      <div className="rounded-card border border-line bg-panel p-4">
        <p className="font-display text-lg font-semibold text-gold">{title}</p>
        <p className="truncate text-xs text-muted">{subtitle || "\u00a0"}</p>
      </div>

      <nav className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              className={cn(
                "relative whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-gold text-ink"
                  : "border border-line text-muted hover:text-cream lg:border-transparent",
              )}
            />
          );
        })}
      </nav>

      <div className="hidden lg:block">
        <LogoutButton />
      </div>
    </aside>
  );
}
