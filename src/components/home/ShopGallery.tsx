import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShopCard } from "@/components/shop/ShopCard";
import type { BarberShop } from "@/lib/types";

interface ShopGalleryProps {
  readonly shops: readonly BarberShop[];
}

export function ShopGallery({ shops }: ShopGalleryProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Մեր խանութները"
          title="Ընտրիր քո barber shop-ը"
          description="Քաղաքի լավագույն salon-ները՝ փորձառու վարպետներով և ժամանակակից սպասարկմամբ:"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </Container>
    </section>
  );
}
