import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { BarberList } from "@/components/shop/BarberList";
import { getShopWithBarbers } from "@/lib/data/queries";

interface ShopPageProps {
  readonly params: Promise<{ readonly shopId: string }>;
}

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const shop = await getShopWithBarbers(shopId);
  if (!shop) return { title: "Խանութը չի գտնվել" };
  return { title: shop.name, description: shop.description };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { shopId } = await params;
  const shop = await getShopWithBarbers(shopId);

  if (!shop) notFound();

  return (
    <>
      <ShopHeader shop={shop} />
      <BarberList
        barbers={shop.barbers}
        shopName={shop.name}
        services={shop.services}
      />
    </>
  );
}
