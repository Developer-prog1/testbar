import type { ServiceType } from "@/lib/types";

export const SERVICE_LABELS: Readonly<Record<ServiceType, string>> = {
  haircut: "Սանրվածք",
  beard: "Մորուք",
  shave: "Սափրում",
  kids: "Մանկական",
  styling: "Styling",
};

export const ALL_SERVICES: readonly ServiceType[] = [
  "haircut",
  "beard",
  "shave",
  "kids",
  "styling",
];

/** How long each service blocks the schedule (minutes, multiples of the base slot). */
export const SERVICE_DURATION_MINUTES: Readonly<Record<ServiceType, number>> = {
  haircut: 60,
  beard: 30,
  shave: 30,
  kids: 60,
  styling: 90,
};

/** Working hours used to generate daily slots. */
export const WORKING_HOUR_START = 10;
export const WORKING_HOUR_END = 20;
/** Base scheduling granularity. Service durations are multiples of this. */
export const SLOT_DURATION_MINUTES = 30;

/** Number of upcoming days shown in the booking picker. */
export const BOOKING_DAYS_AHEAD = 7;

export const PHONE_PATTERN = /^\+374\d{8}$/;
export const MIN_NAME_LENGTH = 2;

export const SITE_NAME = "Lord & Blade";
export const SITE_TAGLINE = "Արհեստավարժ barber shop-եր մեկ տեղում";

/** Hero carousel background images (rotated on the home page). */
export const HERO_IMAGES: readonly string[] = [
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1920&h=1080&q=80",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&h=1080&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&h=1080&q=80",
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1920&h=1080&q=80",
];

/** Hero carousel auto-advance interval (ms). */
export const HERO_ROTATE_INTERVAL_MS = 5000;
