import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly align?: "left" | "center";
  readonly className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
