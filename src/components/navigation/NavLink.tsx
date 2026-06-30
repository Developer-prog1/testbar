"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PendingIndicator } from "@/components/navigation/PendingIndicator";
import { cn } from "@/lib/cn";

interface NavLinkProps {
  readonly href: string;
  readonly label: string;
  readonly className?: string;
  readonly pendingClassName?: string;
  readonly onNavigate?: () => void;
}

function NavLinkInner({
  href,
  label,
  className,
  pendingClassName,
  onNavigate,
}: NavLinkProps) {
  const router = useRouter();

  const prefetch = () => {
    router.prefetch(href);
  };

  return (
    <Link
      href={href}
      prefetch
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
      onClick={onNavigate}
      className={className}
    >
      {label}
      <PendingIndicator className={pendingClassName} />
    </Link>
  );
}

export function NavLink(props: NavLinkProps) {
  return (
    <Suspense
      fallback={
        <Link href={props.href} prefetch className={props.className}>
          {props.label}
        </Link>
      }
    >
      <NavLinkInner {...props} />
    </Suspense>
  );
}

interface NavLogoProps {
  readonly className?: string;
  readonly pendingClassName?: string;
}

function NavLogoInner({ className, pendingClassName }: NavLogoProps) {
  const router = useRouter();

  const prefetch = () => {
    router.prefetch("/");
  };

  return (
    <Link
      href="/"
      prefetch
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
      className={className}
    >
      <span className="text-gold">L</span>ord <span className="text-gold">&</span> Blade
      <PendingIndicator className={cn("rounded-lg", pendingClassName)} />
    </Link>
  );
}

export function NavLogo({ className, pendingClassName }: NavLogoProps) {
  return (
    <Suspense
      fallback={
        <Link href="/" prefetch className={className}>
          <span className="text-gold">L</span>ord <span className="text-gold">&</span> Blade
        </Link>
      }
    >
      <NavLogoInner className={className} pendingClassName={pendingClassName} />
    </Suspense>
  );
}
