interface RatingProps {
  readonly value: number;
}

export function Rating({ value }: RatingProps) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-gold">
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="h-4 w-4"
      >
        <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
      </svg>
      {value.toFixed(1)}
    </span>
  );
}
