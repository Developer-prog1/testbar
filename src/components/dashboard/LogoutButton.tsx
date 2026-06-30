"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-line px-3 py-2 text-sm text-muted transition-colors hover:border-red-500/50 hover:text-red-400"
    >
      Դուրս գալ
    </button>
  );
}
