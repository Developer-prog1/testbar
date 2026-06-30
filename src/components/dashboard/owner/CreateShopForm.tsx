"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export function CreateShopForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const res = await fetch("/api/dashboard/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        id="name"
        label="Խանութի անվանում"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Ստեղծում..." : "Ստեղծել խանութ"}
      </Button>
    </form>
  );
}
