"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import type { Role } from "@prisma/client";

interface Fields {
  readonly email: string;
  readonly password: string;
  readonly shopName: string;
  readonly firstName: string;
  readonly lastName: string;
}

const EMPTY: Fields = {
  email: "",
  password: "",
  shopName: "",
  firstName: "",
  lastName: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("owner");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof Fields, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const buildPayload = () =>
    role === "owner"
      ? {
          role,
          email: fields.email,
          password: fields.password,
          shopName: fields.shopName,
        }
      : {
          role,
          email: fields.email,
          password: fields.password,
          firstName: fields.firstName,
          lastName: fields.lastName,
        };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });
    setLoading(false);

    if (res.status === 409) return setError("Այս email-ն արդեն գրանցված է:");
    if (!res.ok) return setError("Ստուգեք դաշտերը (գաղտնաբառ՝ նվազ. 8 նիշ):");

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-card border border-line bg-panel p-6"
    >
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-line p-1">
        <RoleTab active={role === "owner"} onClick={() => setRole("owner")}>
          Խանութի տեր
        </RoleTab>
        <RoleTab active={role === "barber"} onClick={() => setRole("barber")}>
          Վարսավիր
        </RoleTab>
      </div>

      <TextField
        id="email"
        label="Email"
        type="email"
        value={fields.email}
        onChange={(event) => set("email", event.target.value)}
        autoComplete="email"
      />
      <TextField
        id="password"
        label="Գաղտնաբառ"
        type="password"
        value={fields.password}
        onChange={(event) => set("password", event.target.value)}
        autoComplete="new-password"
      />

      {role === "owner" ? (
        <TextField
          id="shopName"
          label="Խանութի անուն"
          value={fields.shopName}
          onChange={(event) => set("shopName", event.target.value)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="firstName"
            label="Անուն"
            value={fields.firstName}
            onChange={(event) => set("firstName", event.target.value)}
          />
          <TextField
            id="lastName"
            label="Ազգանուն"
            value={fields.lastName}
            onChange={(event) => set("lastName", event.target.value)}
          />
        </div>
      )}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Գրանցում..." : "Գրանցվել"}
      </Button>
      <p className="text-center text-sm text-muted">
        Արդեն ունե՞ս հաշիվ{" "}
        <Link href="/login" className="text-gold hover:underline">
          Մուտք
        </Link>
      </p>
    </form>
  );
}

interface RoleTabProps {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
}

function RoleTab({ active, onClick, children }: RoleTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg py-2 text-sm transition-colors",
        active ? "bg-gold text-ink" : "text-muted hover:text-cream",
      )}
    >
      {children}
    </button>
  );
}
