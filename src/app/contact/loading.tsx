import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ContactLoading() {
  return (
    <Container
      className="grid gap-10 py-12 sm:py-16 lg:grid-cols-2"
      aria-busy
      aria-label="Բեռնվում է"
    >
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <Skeleton className="h-80 rounded-card" />
    </Container>
  );
}
