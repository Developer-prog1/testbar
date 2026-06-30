"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    const res = await fetch("/api/dashboard/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      setCurrentPassword("");
      setNewPassword("");
      setMessage({ ok: true, text: "Գաղտնաբառը փոխված է:" });
    } else if (res.status === 401) {
      setMessage({ ok: false, text: "Ընթացիկ գաղտնաբառը սխալ է:" });
    } else {
      setMessage({ ok: false, text: "Նոր գաղտնաբառը պետք է լինի ≥ 8 նիշ:" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        id="current-password"
        label="Ընթացիկ գաղտնաբառ"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        autoComplete="current-password"
      />
      <TextField
        id="new-password"
        label="Նոր գաղտնաբառ"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
      />
      {message ? (
        <p className={message.ok ? "text-sm text-green-400" : "text-sm text-red-400"}>
          {message.text}
        </p>
      ) : null}
      <div>
        <Button type="submit">Փոխել գաղտնաբառը</Button>
      </div>
    </form>
  );
}
