import type {
  Barber as PBarber,
  BarberShop as PShop,
  Certificate as PCert,
  ServiceDuration as PDuration,
} from "@prisma/client";
import { SERVICE_DURATION_MINUTES } from "@/lib/constants";
import { resolveImageSrc } from "@/lib/images";
import type {
  Barber,
  BarberShop,
  Certificate,
  ServiceType,
} from "@/lib/types";

export const mapShop = (shop: PShop): BarberShop => ({
  id: shop.id,
  name: shop.name,
  district: shop.district,
  address: shop.address,
  description: shop.description,
  imageUrl: resolveImageSrc(shop.imageId, shop.imageUrl),
  coverImageUrl: resolveImageSrc(shop.coverImageId, shop.coverImageUrl),
  services: shop.services as ServiceType[],
  rating: shop.rating,
});

export const mapDurations = (
  durations: readonly PDuration[],
): Record<ServiceType, number> => {
  const result = { ...SERVICE_DURATION_MINUTES };
  for (const item of durations) {
    result[item.service as ServiceType] = item.minutes;
  }
  return result;
};

const mapCertificate = (cert: PCert): Certificate => ({
  id: cert.id,
  title: cert.title,
  issuer: cert.issuer,
  year: cert.year,
  imageUrl: resolveImageSrc(cert.imageId, cert.imageUrl),
});

type BarberWithRelations = PBarber & {
  serviceDurations: PDuration[];
  certificates: PCert[];
};

export const mapBarber = (
  barber: BarberWithRelations,
  shopId: string,
): Barber => ({
  id: barber.id,
  shopId,
  firstName: barber.firstName,
  lastName: barber.lastName,
  yearsExperience: barber.yearsExperience,
  specialty: barber.specialty,
  photoUrl: resolveImageSrc(barber.photoId, barber.photoUrl),
  serviceDurations: mapDurations(barber.serviceDurations),
  certificates: barber.certificates.map(mapCertificate),
});
