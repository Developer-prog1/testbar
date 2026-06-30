import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Readonly<Record<Variant, string>> = {
  primary: "bg-gold text-ink hover:bg-gold-soft",
  outline: "border border-gold/60 text-gold hover:bg-gold/10",
  ghost: "text-cream hover:bg-panel",
};

const SIZES: Readonly<Record<Size, string>> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

interface CommonProps {
  readonly variant?: Variant;
  readonly size?: Size;
  readonly className?: string;
  readonly children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    readonly href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  readonly href: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
