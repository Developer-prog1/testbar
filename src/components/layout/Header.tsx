"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/", label: "Գլխավոր" },
  { href: "/products", label: "Խանութներ" },
  { href: "/contact", label: "Կապ" },
  { href: "/dashboard", label: "Հաշիվ" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold tracking-wide">
          <span className="text-gold">L</span>ord <span className="text-gold">&</span> Blade
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-wide transition-colors hover:text-gold",
                isActive(link.href) ? "text-gold" : "text-muted",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Ընտրացանկ"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-cream md:hidden"
        >
          <span className="sr-only">{SITE_NAME} ընտրացանկ</span>
          <div className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 bg-cream" />
            <span className="h-0.5 w-5 bg-cream" />
            <span className="h-0.5 w-5 bg-cream" />
          </div>
        </button>
      </Container>

      {open ? (
        <nav className="border-t border-line/70 bg-ink md:hidden">
          <Container className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-2 py-3 text-sm transition-colors hover:bg-panel",
                  isActive(link.href) ? "text-gold" : "text-cream",
                )}
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
