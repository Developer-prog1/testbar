import { PrismaClient, type ServiceType } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "Password123!";
const DEFAULT_DURATIONS: Record<ServiceType, number> = {
  haircut: 60,
  beard: 30,
  shave: 30,
  kids: 60,
  styling: 90,
};

const img = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

interface SeedBarber {
  readonly key: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly yearsExperience: number;
  readonly specialty: string;
  readonly photo: string;
  readonly certificates?: ReadonlyArray<{
    title: string;
    issuer: string;
    year: number;
    image: string;
  }>;
}

interface SeedShop {
  readonly slug: string;
  readonly name: string;
  readonly district: string;
  readonly address: string;
  readonly description: string;
  readonly image: string;
  readonly cover: string;
  readonly services: ServiceType[];
  readonly rating: number;
  readonly barbers: SeedBarber[];
}

const SHOPS: SeedShop[] = [
  {
    slug: "elite-barber",
    name: "Elite Barber",
    district: "Կենտրոն",
    address: "Աբովյան 12, Երևան",
    description: "Դասական barber shop՝ պրեմիում սպասարկմամբ.",
    image: img("photo-1503951914875-452162b0f3f1"),
    cover: img("photo-1599351431202-1e0f0137899a", 1600, 700),
    services: ["haircut", "beard", "shave"],
    rating: 4.9,
    barbers: [
      {
        key: "aram",
        firstName: "Արամ",
        lastName: "Հովհաննիսյան",
        yearsExperience: 12,
        specialty: "Classic fade",
        photo: img("photo-1500648767791-00dcc994a43e", 400, 400),
        certificates: [
          {
            title: "Master Barber Certification",
            issuer: "London Barber Academy",
            year: 2018,
            image: img("photo-1606760227091-3dd870d97f1d", 600, 420),
          },
        ],
      },
      {
        key: "davit",
        firstName: "Դավիթ",
        lastName: "Սարգսյան",
        yearsExperience: 7,
        specialty: "Մորուքի ձևավորում",
        photo: img("photo-1507003211169-0a1dd7228f2d", 400, 400),
      },
    ],
  },
  {
    slug: "gentlemans-club",
    name: "Gentleman's Club",
    district: "Արաբկիր",
    address: "Կոմիտաս 45, Երևան",
    description: "Ժամանակակից ոճ և հանգիստ մթնոլորտ.",
    image: img("photo-1521590832167-7bcbfaa6381f"),
    cover: img("photo-1585747860715-2ba37e788b70", 1600, 700),
    services: ["haircut", "styling", "kids"],
    rating: 4.7,
    barbers: [
      {
        key: "tigran",
        firstName: "Տիգրան",
        lastName: "Պետրոսյան",
        yearsExperience: 9,
        specialty: "Modern styling",
        photo: img("photo-1519085360753-af0119f7cbe7", 400, 400),
      },
    ],
  },
  {
    slug: "sharp-blade",
    name: "Sharp Blade",
    district: "Կենտրոն",
    address: "Թումանյան 8, Երևան",
    description: "Ավանդական ածելիով սափրում և ճշգրիտ fade-եր.",
    image: img("photo-1605497788044-5a32c7078486"),
    cover: img("photo-1622286342621-4bd786c2447c", 1600, 700),
    services: ["haircut", "beard", "shave", "styling"],
    rating: 4.8,
    barbers: [
      {
        key: "vahagn",
        firstName: "Վահագն",
        lastName: "Մարտիրոսյան",
        yearsExperience: 15,
        specialty: "Ածելիով սափրում",
        photo: img("photo-1488161628813-04466f872be2", 400, 400),
      },
    ],
  },
];

async function storeImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const mimeType = res.headers.get("content-type") ?? "image/jpeg";
    const image = await prisma.image.create({ data: { data: buffer, mimeType } });
    return image.id;
  } catch {
    return null;
  }
}

async function clearDatabase(): Promise<void> {
  await prisma.booking.deleteMany();
  await prisma.serviceDuration.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.barber.deleteMany();
  await prisma.barberShop.deleteMany();
  await prisma.user.deleteMany();
  await prisma.image.deleteMany();
}

async function createBarber(
  passwordHash: string,
  shopId: string,
  data: SeedBarber,
  email: string,
): Promise<void> {
  const user = await prisma.user.create({
    data: { email, passwordHash, role: "barber" },
  });
  const photoId = await storeImage(data.photo);

  const barber = await prisma.barber.create({
    data: {
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      yearsExperience: data.yearsExperience,
      specialty: data.specialty,
      photoId,
      photoUrl: data.photo,
      memberships: {
        create: { shopId, status: "confirmed", initiatedBy: "owner" },
      },
      serviceDurations: {
        create: (Object.keys(DEFAULT_DURATIONS) as ServiceType[]).map(
          (service) => ({ service, minutes: DEFAULT_DURATIONS[service] }),
        ),
      },
      workingHours: {
        create: [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
          dayOfWeek,
          startMinute: 10 * 60,
          endMinute: 20 * 60,
          enabled: true,
        })),
      },
    },
  });

  for (const cert of data.certificates ?? []) {
    const imageId = await storeImage(cert.image);
    await prisma.certificate.create({
      data: {
        barberId: barber.id,
        title: cert.title,
        issuer: cert.issuer,
        year: cert.year,
        imageId,
        imageUrl: cert.image,
      },
    });
  }
}

async function main(): Promise<void> {
  console.log("Clearing database...");
  await clearDatabase();
  const passwordHash = await hash(DEFAULT_PASSWORD);

  for (const [index, shop] of SHOPS.entries()) {
    const ownerEmail =
      index === 0 ? "owner@test.am" : `owner.${shop.slug}@demo.am`;
    const owner = await prisma.user.create({
      data: { email: ownerEmail, passwordHash, role: "owner" },
    });

    const imageId = await storeImage(shop.image);
    const coverImageId = await storeImage(shop.cover);

    const created = await prisma.barberShop.create({
      data: {
        ownerId: owner.id,
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        district: shop.district,
        address: shop.address,
        services: shop.services,
        rating: shop.rating,
        imageId,
        coverImageId,
        imageUrl: shop.image,
        coverImageUrl: shop.cover,
      },
    });

    for (const [bIndex, barber] of shop.barbers.entries()) {
      const email =
        index === 0 && bIndex === 0
          ? "barber@test.am"
          : `barber.${barber.key}@demo.am`;
      await createBarber(passwordHash, created.id, barber, email);
      console.log(`  + barber ${barber.firstName} (${email})`);
    }
    console.log(`Shop ${shop.name} (${ownerEmail})`);
  }

  console.log("\nSeed complete.");
  console.log("Test owner:  owner@test.am  /  Password123!");
  console.log("Test barber: barber@test.am /  Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
