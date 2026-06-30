import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const HIGHLIGHTS = [
  { value: "15+", label: "Տարվա փորձ" },
  { value: "20", label: "Վարպետ" },
  { value: "10k+", label: "Գոհ հաճախորդ" },
] as const;

export function AboutSection() {
  return (
    <section className="border-y border-line/70 bg-ink-soft py-16 sm:py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[5/4] overflow-hidden rounded-card border border-line">
          <Image
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&h=720&q=80"
            alt="Մեր barber shop-ը"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Մեր մասին"
            title="Ավանդույթ, որ ապրում է դետալներում"
            description="Մենք միավորում ենք քաղաքի լավագույն վարպետներին մեկ հարթակում: Ամեն սանրվածք՝ ճշգրտություն, խնամք և անհատական մոտեցում:"
          />
          <dl className="grid grid-cols-3 gap-4">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-line bg-panel p-4 text-center"
              >
                <dt className="font-display text-2xl font-semibold text-gold">
                  {item.value}
                </dt>
                <dd className="mt-1 text-xs text-muted">{item.label}</dd>
              </div>
            ))}
          </dl>
          <div>
            <Button href="/contact" size="lg">
              Կապ հաստատել մեզ հետ
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
