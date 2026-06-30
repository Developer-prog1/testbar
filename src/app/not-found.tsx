import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-display text-6xl font-semibold text-gold">404</p>
      <h1 className="font-display text-2xl font-semibold">Էջը չի գտնվել</h1>
      <p className="text-sm text-muted">Հնարավոր է հղումը սխալ է կամ էջը հեռացվել է:</p>
      <Button href="/" size="lg" className="mt-2">
        Վերադառնալ գլխավոր
      </Button>
    </Container>
  );
}
