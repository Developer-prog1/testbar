export const PLACEHOLDER_IMAGE = "/placeholder.svg";

/**
 * Resolves the best image source: a DB-stored image (served via our API),
 * otherwise an external fallback URL, otherwise a placeholder.
 */
export const resolveImageSrc = (
  imageId?: string | null,
  fallbackUrl?: string | null,
): string => {
  if (imageId) return `/api/images/${imageId}`;
  return fallbackUrl ?? PLACEHOLDER_IMAGE;
};
