"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);

    if (!res.ok) {
      setError("Սխալ email կամ գաղտնաբառ:");
      return;
    }
    router.push(params.get("next") ?? "/dashboard");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-card border border-line bg-panel p-6"
    >
      <TextField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
      />
      <TextField
        id="password"
        label="Գաղտնաբառ"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
      />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Մուտք..." : "Մուտք"}
      </Button>
      <p className="text-center text-sm text-muted">
        Հաշիվ չունե՞ս{" "}
        <Link href="/register" className="text-gold hover:underline">
          Գրանցվել
        </Link>
      </p>
    </form>
  );
}
