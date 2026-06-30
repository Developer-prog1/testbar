import type { SessionUser } from "@/lib/auth/current-user";

/** Human-readable label for dashboard sidebars. */
export function sessionDisplayName(user: SessionUser): string {
  if (user.barber) {
    const name = `${user.barber.firstName} ${user.barber.lastName}`.trim();
    if (name) return name;
  }
  if (user.shop?.name) return user.shop.name;
  return user.email;
}
