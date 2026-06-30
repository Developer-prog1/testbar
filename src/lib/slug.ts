const RANDOM_SUFFIX_LENGTH = 5;

/** URL-safe slug; appends a short random suffix to keep it unique. */
export const slugify = (value: string): string => {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random()
    .toString(36)
    .slice(2, 2 + RANDOM_SUFFIX_LENGTH);
  return base ? `${base}-${suffix}` : `shop-${suffix}`;
};
