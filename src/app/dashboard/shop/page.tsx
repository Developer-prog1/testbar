import { requireOwnerShop } from "@/lib/auth/api";
import { getCurrentUser } from "@/lib/auth/current-user";
import { Panel } from "@/components/dashboard/Panel";
import { CreateShopForm } from "@/components/dashboard/owner/CreateShopForm";
import {
  ShopProfileForm,
  type ShopDto,
} from "@/components/dashboard/owner/ShopProfileForm";
import { resolveImageSrc } from "@/lib/images";
import type { ServiceType } from "@/lib/types";

export default async function OwnerShopPage() {
  const user = await getCurrentUser();
  if (!user?.shop) {
    return (
      <Panel
        title="Ստեղծիր քո խանութը"
        description="Դեռ խանութ չունես: Ստեղծիր մեկը՝ սկսելու համար:"
      >
        <CreateShopForm />
      </Panel>
    );
  }

  await requireOwnerShop();
  const shop = user.shop;
  const dto: ShopDto = {
    name: shop.name,
    description: shop.description,
    district: shop.district,
    address: shop.address,
    lat: shop.lat,
    lng: shop.lng,
    services: shop.services as ServiceType[],
    imageId: shop.imageId,
    coverImageId: shop.coverImageId,
    imageSrc: shop.imageId ? resolveImageSrc(shop.imageId, shop.imageUrl) : null,
    coverSrc: shop.coverImageId
      ? resolveImageSrc(shop.coverImageId, shop.coverImageUrl)
      : null,
  };

  return (
    <Panel
      title="Իմ խանութը"
      description="Թարմացրու տվյալները և նկարները՝ դրանք երևում են /products-ում:"
    >
      <ShopProfileForm shop={dto} />
    </Panel>
  );
}
