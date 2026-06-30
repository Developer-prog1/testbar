"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export interface MembershipDto {
  readonly id: string;
  readonly status: "pending" | "confirmed" | "rejected";
  readonly initiatedBy: "owner" | "barber";
  readonly name: string;
  readonly email: string;
  readonly photoSrc: string;
}

interface BarbersManagerProps {
  readonly confirmed: readonly MembershipDto[];
  readonly pending: readonly MembershipDto[];
}

export function BarbersManager({ confirmed, pending }: BarbersManagerProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const act = async (url: string, method: "PATCH" | "DELETE") => {
    const res = await fetch(url, { method });
    if (res.ok) router.refresh();
  };

  const invite = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    const res = await fetch("/api/dashboard/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "invite", email }),
    });
    if (res.ok) {
      setEmail("");
      setMessage("Հրավերն ուղարկված է:");
      router.refresh();
    } else if (res.status === 404) {
      setMessage("Այս email-ով վարսավիր չի գտնվել:");
    } else {
      setMessage("Սխալ:");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={invite} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <TextField
            id="invite-email"
            label="Հրավիրել վարսավիր (email)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit">Հրավիրել</Button>
      </form>
      {message ? <p className="text-sm text-muted">{message}</p> : null}

      <List
        title={`Հաստատված (${confirmed.length})`}
        items={confirmed}
        render={(m) => (
          <Button variant="ghost" onClick={() => act(`/api/dashboard/memberships/${m.id}`, "DELETE")}>
            Հեռացնել
          </Button>
        )}
      />

      <List
        title={`Սպասվող (${pending.length})`}
        items={pending}
        render={(m) =>
          m.initiatedBy === "barber" ? (
            <div className="flex gap-2">
              <Button onClick={() => act(`/api/dashboard/memberships/${m.id}`, "PATCH")}>
                Հաստատել
              </Button>
              <Button variant="ghost" onClick={() => act(`/api/dashboard/memberships/${m.id}`, "DELETE")}>
                Մերժել
              </Button>
            </div>
          ) : (
            <span className="text-xs text-muted">Սպասում է վարսավիրի հաստատմանը</span>
          )
        }
      />
    </div>
  );
}

interface ListProps {
  readonly title: string;
  readonly items: readonly MembershipDto[];
  readonly render: (item: MembershipDto) => React.ReactNode;
}

function List({ title, items, render }: ListProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-cream">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted">Ցուցակը դատարկ է:</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-line bg-ink-soft p-3"
          >
            <Image
              src={item.photoSrc}
              alt={item.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-cream">{item.name}</p>
              <p className="truncate text-xs text-muted">{item.email}</p>
            </div>
            {render(item)}
          </div>
        ))
      )}
    </div>
  );
}
