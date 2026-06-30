import { Skeleton } from "@/components/ui/Skeleton";

export function PanelSkeleton() {
  return (
    <section
      className="rounded-card border border-line bg-panel p-5 sm:p-6"
      aria-hidden
    >
      <header className="mb-4 flex flex-col gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </header>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
      </div>
    </section>
  );
}
