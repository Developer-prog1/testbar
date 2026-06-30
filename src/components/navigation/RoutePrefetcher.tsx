"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PUBLIC_ROUTES = [
  "/",
  "/products",
  "/contact",
  "/login",
  "/register",
  "/dashboard",
] as const;

export function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    for (const route of PUBLIC_ROUTES) {
      router.prefetch(route);
    }
  }, [router]);

  return null;
}
