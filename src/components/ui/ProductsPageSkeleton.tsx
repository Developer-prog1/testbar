import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export function ProductsPageSkeleton() {
  return (
    <Container className="flex flex-col gap-8 py-12 sm:py-16" aria-busy aria-label="Բեռնվում է">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-56 rounded-card" />
        ))}
      </div>
    </Container>
  );
}
