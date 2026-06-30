import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductsView } from "@/components/products/ProductsView";
import { ProductsContentSkeleton } from "@/components/products/ProductsContentSkeleton";
import { getCachedDistricts, getCachedShopsAll } from "@/lib/data/cached-queries";

export const metadata: Metadata = {
  title: "Խանութներ",
  description: "Ընտրիր barber shop-ը ֆիլտրերով՝ ըստ թաղամասի և ծառայության:",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [shops, districts] = await Promise.all([
    getCachedShopsAll(),
    getCachedDistricts(),
  ]);

  return (
    <Container className="flex flex-col gap-8 py-12 sm:py-16">
      <SectionHeading
        eyebrow="Խանութներ"
        title="Գտիր քո barber shop-ը"
        description="Օգտագործիր ֆիլտրերը՝ ճիշտ վայրն ու ծառայությունը գտնելու համար:"
      />

      <Suspense fallback={<ProductsContentSkeleton />}>
        <ProductsView shops={shops} districts={districts} />
      </Suspense>
    </Container>
  );
}
