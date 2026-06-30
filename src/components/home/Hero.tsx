import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SITE_TAGLINE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1920&h=1080&q=80"
          alt="Barber shop"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      </div>

      <Container className="flex min-h-[78vh] flex-col justify-center gap-6 py-20 sm:min-h-[80vh]">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold sm:text-sm">
          Premium Barber Experience
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Քո ոճը՝ <span className="text-gold">վարպետի</span> ձեռքերում
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
          {SITE_TAGLINE}. Ընտրիր խանութը, վարպետին և ամրագրիր ազատ ժամը մի քանի
          քայլով:
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/products" size="lg">
            Դեպի խանութներ
          </Button>
          <Button href="/contact" size="lg" variant="outline">
            Կապ հաստատել
          </Button>
        </div>
      </Container>
    </section>
  );
}
