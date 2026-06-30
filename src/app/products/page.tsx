import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShopFilters } from "@/components/products/ShopFilters";
import { ShopCard } from "@/components/shop/ShopCard";
import { asServiceType, getDistricts, listShops } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Խանութներ",
  description: "Ընտրիր barber shop-ը ֆիլտրերով՝ ըստ թաղամասի և ծառայության:",
};

interface ProductsPageProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const asString = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;
  const [shops, districts] = await Promise.all([
    listShops({
      district: asString(sp.district),
      service: asServiceType(asString(sp.service)),
      search: asString(sp.search),
    }),
    getDistricts(),
  ]);

  return (
    <Container className="flex flex-col gap-8 py-12 sm:py-16">
      <SectionHeading
        eyebrow="Խանութներ"
        title="Գտիր քո barber shop-ը"
        description="Օգտագործիր ֆիլտրերը՝ ճիշտ վայրն ու ծառայությունը գտնելու համար:"
      />

      <ShopFilters districts={districts} />

      {shops.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-panel p-12 text-center">
          <p className="text-cream">Արդյունք չի գտնվել:</p>
          <p className="mt-1 text-sm text-muted">Փորձիր փոխել ֆիլտրերը:</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </Container>
  );
}
