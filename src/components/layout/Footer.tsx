import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line/70 bg-ink-soft">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <span className="font-display text-lg font-semibold text-gold">
            {SITE_NAME}
          </span>
          <p className="max-w-xs text-sm text-muted">{SITE_TAGLINE}</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm text-muted">
          <span className="mb-1 font-medium text-cream">Նավիգացիա</span>
          <Link href="/" prefetch className="hover:text-gold">Գլխավոր</Link>
          <Link href="/products" prefetch className="hover:text-gold">Խանութներ</Link>
          <Link href="/contact" prefetch className="hover:text-gold">Կապ</Link>
        </nav>

        <div className="flex flex-col gap-2 text-sm text-muted">
          <span className="mb-1 font-medium text-cream">Կոնտակտ</span>
          <a href="tel:+37410000000" className="hover:text-gold">+374 10 000 000</a>
          <a href="mailto:hello@lordblade.am" className="hover:text-gold">
            hello@lordblade.am
          </a>
          <span>Աբովյան 12, Երևան</span>
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted">
          <span className="mb-1 font-medium text-cream">Աշխատաժամ</span>
          <span>Երկ–Շաբ՝ 10:00–20:00</span>
          <span>Կիրակի՝ փակ</span>
        </div>
      </Container>

      <div className="border-t border-line/70">
        <Container className="py-5 text-center text-xs text-muted">
          © {YEAR} {SITE_NAME}. Բոլոր իրավունքները պաշտպանված են.
        </Container>
      </div>
    </footer>
  );
}
