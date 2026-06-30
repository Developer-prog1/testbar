# Նախագծի տեխզադրանք

> **Barber Shop** — salon showcase + online ամրագրում  
> Մանրամասն էջերի spec → [`BARBER_SHOP_SPEC.md`](./BARBER_SHOP_SPEC.md)

---

## Նկարագրություն

Barber Shop-ի վեբ-կայք, որտեղ посетители-ն կարող են դիտել salon-ները և barber-ներին, ընտրել ազատ ժամ և ամրագրել visit։ Home էջը ներկայացնում է brand-ը, `/products`-ում shop-երն են ֆիլտրով, single page-ում barber-ները, click-ից բացվում է ամրագրման modal։

## Թիրախային լսարան

- Salon-ի հաճախորդներ — ամրագրում online
- Salon-ի սեփականատեր / ադմին — ժամանակացույցի կառավարում (Phase 2+)

## Հիմնական ֆունկցիաներ (առաջնայնացված)

1. **Home** (hero, gallery, about, footer) — առաջնայնություն. բարձր
2. **Shop list** (`/products` + ֆիլտրեր) — առաջնայնություն. բարձր
3. **Shop detail + barber list** — առաջնայնություն. բարձր
4. **Booking modal** (time slots + form) — առաջնայնություն. բարձր
5. **Contact** — առաջնայնություն. միջին
6. **Admin / notifications** — առաջնայնություն. ցածր (Phase 2–3)

## Stack (եթե որոշված է)

- **Տարբերակ A** — fullstack Next.js Vercel-ում *(առաջարկվող Size A)*
- **Տարբերակ B** — Next.js frontend + NestJS backend
- Որոշում pending — TECH_CARD հաստատումից հետո

## Դիզայն

- Figma — TBD
- UI — Tailwind, barber/salon aesthetic (dark + gold accents — TBD)

## Ինտեգրացիաներ

- [ ] Email (Resend) — contact + booking confirmation
- [ ] Ֆайлերի պահոց (Cloudflare R2) — shop/barber նկարներ
- [ ] Աուտենտիֆիկացիա — Phase 3 (admin)
- [ ] Վճարային համակարգ — ոչ v1

## Կոնտենտի լեզու

- Ինտերֆեյսի հիմնական լեզու. **hy**
- i18n. ոչ v1

## Սահմանափակումներ

- Ժամկետներ. առանց դедлайնի
- v1 — ամրագրում առանց online վճարման

## Լրացուցիչ

- Մանրամասն UX, routes, data model, API → [`BARBER_SHOP_SPEC.md`](./BARBER_SHOP_SPEC.md)
