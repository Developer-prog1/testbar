import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "@/app/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RoutePrefetcher } from "@/components/navigation/RoutePrefetcher";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Barber Shop`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
};

export const viewport: Viewport = {
  themeColor: "#0e0e10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="hy">
      <body className="flex min-h-screen flex-col">
        <Suspense fallback={null}>
          <RoutePrefetcher />
        </Suspense>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
