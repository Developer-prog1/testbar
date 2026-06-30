import { z } from "zod";
import { MIN_NAME_LENGTH, PHONE_PATTERN } from "@/lib/constants";

const name = z.string().trim().min(MIN_NAME_LENGTH, "Նվազագույնը 2 նիշ");

export const serviceEnum = z.enum([
  "haircut",
  "beard",
  "shave",
  "kids",
  "styling",
]);

export const bookingSchema = z.object({
  barberId: z.string().min(1),
  startsAt: z.string().datetime(),
  services: z.array(serviceEnum).min(1, "Ընտրիր գոնե մեկ ծառայություն"),
  clientFirstName: name,
  clientLastName: name,
  clientPhone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Ֆորմատ՝ +374XXXXXXXX"),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: name,
  contact: z.string().trim().min(MIN_NAME_LENGTH, "Պարտադիր դաշտ"),
  message: z.string().trim().min(10, "Նվազագույնը 10 նիշ"),
});

export type ContactInput = z.infer<typeof contactSchema>;

const email = z.string().trim().toLowerCase().email("Սխալ email");
const password = z.string().min(8, "Նվազագույնը 8 նիշ");

export const loginSchema = z.object({ email, password });
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("owner"),
    email,
    password,
    shopName: z.string().trim().min(MIN_NAME_LENGTH, "Խանութի անունը պարտադիր է"),
  }),
  z.object({
    role: z.literal("barber"),
    email,
    password,
    firstName: name,
    lastName: name,
  }),
]);
export type RegisterInput = z.infer<typeof registerSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Պարտադիր դաշտ"),
  newPassword: password,
});

export const statusUpdateSchema = z.object({
  status: z.enum(["draft", "active"]),
});

export const heroSlideSchema = z.object({
  imageId: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
}).refine((data) => data.imageId || data.imageUrl, {
  message: "image_required",
});

export const shopUpdateSchema = z.object({
  name: z.string().trim().min(MIN_NAME_LENGTH).optional(),
  description: z.string().trim().max(600).optional(),
  district: z.string().trim().max(100).optional(),
  address: z.string().trim().max(200).optional(),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  services: z.array(serviceEnum).optional(),
  imageId: z.string().nullable().optional(),
  coverImageId: z.string().nullable().optional(),
});

export const shopCreateSchema = z.object({
  name: z.string().trim().min(MIN_NAME_LENGTH, "Անունը պարտադիր է"),
});

export const barberProfileSchema = z.object({
  firstName: name.optional(),
  lastName: name.optional(),
  specialty: z.string().trim().max(120).optional(),
  yearsExperience: z.number().int().min(0).max(70).optional(),
  photoId: z.string().nullable().optional(),
});

export const workingHoursSchema = z.array(
  z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    startMinute: z.number().int().min(0).max(1440),
    endMinute: z.number().int().min(0).max(1440),
    enabled: z.boolean(),
  }),
);

export const serviceDurationsSchema = z.array(
  z.object({
    service: serviceEnum,
    minutes: z.number().int().min(15).max(360),
  }),
);

export const certificateSchema = z.object({
  title: z.string().trim().min(2, "Անվանումը պարտադիր է"),
  issuer: z.string().trim().max(120).optional(),
  year: z.number().int().min(1950).max(2100),
  imageId: z.string().nullable().optional(),
});

export const selfBookingSchema = z.object({
  startsAt: z.string().datetime(),
  durationMinutes: z.number().int().min(15).max(360),
  clientName: z.string().trim().min(2, "Անունը պարտադիր է"),
  clientPhone: z.string().trim().regex(PHONE_PATTERN, "Ֆորմատ՝ +374XXXXXXXX"),
});

export const timeBlockSchema = z
  .object({
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    note: z.string().trim().max(200).optional(),
  })
  .refine((data) => new Date(data.endsAt) > new Date(data.startsAt), {
    message: "end_before_start",
  })
  .refine(
    (data) => {
      const diffMs =
        new Date(data.endsAt).getTime() - new Date(data.startsAt).getTime();
      return diffMs >= 15 * 60_000 && diffMs <= 12 * 60 * 60_000;
    },
    { message: "invalid_duration" },
  );
