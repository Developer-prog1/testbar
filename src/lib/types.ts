export type ServiceType = "haircut" | "beard" | "shave" | "kids" | "styling";

export type EntityStatus = "draft" | "active";

export interface AdminShopRow {
  readonly id: string;
  readonly name: string;
  readonly imageUrl: string;
  readonly district: string;
  readonly address: string;
  readonly status: EntityStatus;
  readonly createdAt: string;
}

export interface AdminContactMessage {
  readonly id: string;
  readonly name: string;
  readonly contact: string;
  readonly message: string;
  readonly createdAt: string;
}

export interface HeroSlideRow {
  readonly id: string;
  readonly imageUrl: string;
  readonly sortOrder: number;
}

export interface AdminBarberRow {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly email: string;
  readonly photoUrl: string;
  readonly status: EntityStatus;
  readonly createdAt: string;
}

export interface BarberShop {
  readonly id: string;
  readonly name: string;
  readonly district: string;
  readonly address: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly coverImageUrl: string;
  readonly services: readonly ServiceType[];
  readonly rating: number;
}

export interface Certificate {
  readonly id: string;
  readonly title: string;
  readonly issuer: string;
  readonly year: number;
  readonly imageUrl: string;
}

export interface Barber {
  readonly id: string;
  readonly shopId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly yearsExperience: number;
  readonly specialty: string;
  readonly photoUrl: string;
  readonly serviceDurations: Readonly<Record<ServiceType, number>>;
  readonly certificates?: readonly Certificate[];
}

export type SlotStatus = "available" | "booked" | "blocked";

export interface TimeSlot {
  readonly id: string;
  readonly barberId: string;
  /** ISO 8601 datetime string */
  readonly startsAt: string;
  readonly status: SlotStatus;
}

export interface Booking {
  readonly id: string;
  readonly barberId: string;
  readonly slotId: string;
  readonly services: readonly ServiceType[];
  readonly durationMinutes: number;
  readonly clientFirstName: string;
  readonly clientLastName: string;
  readonly clientPhone: string;
  readonly createdAt: string;
}

export interface BarberShopWithBarbers extends BarberShop {
  readonly barbers: readonly Barber[];
}

export interface ShopFilters {
  readonly district?: string;
  readonly service?: ServiceType;
  readonly search?: string;
}
