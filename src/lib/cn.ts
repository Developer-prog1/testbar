type ClassValue = string | number | false | null | undefined;

/** Minimal className joiner (no external dependency). */
export const cn = (...values: ClassValue[]): string =>
  values.filter(Boolean).join(" ");
