"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/TextField";
import { contactSchema } from "@/lib/validation";

interface FieldState {
  readonly name: string;
  readonly contact: string;
  readonly message: string;
}

const EMPTY: FieldState = { name: "", contact: "", message: "" };

export function ContactForm() {
  const [fields, setFields] = useState<FieldState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key: keyof FieldState, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = contactSchema.safeParse(fields);
    if (!parsed.success) {
      setError("Լրացրու բոլոր դաշտերը (հաղորդագրությունը՝ նվազ. 10 նիշ):");
      return;
    }

    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    setSubmitting(false);

    if (res.ok) {
      setFields(EMPTY);
      setDone(true);
      return;
    }
    setError("Չհաջողվեց ուղարկել: Կրկին փորձիր:");
  };

  if (done) {
    return (
      <div className="rounded-card border border-line bg-panel p-8 text-center">
        <p className="font-display text-xl text-gold">Շնորհակալություն!</p>
        <p className="mt-2 text-sm text-muted">
          Հաղորդագրությունը ստացված է: Մենք կկապվենք քեզ հետ:
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-card border border-line bg-panel p-6"
    >
      <TextField
        id="name"
        label="Անուն"
        value={fields.name}
        onChange={(event) => setField("name", event.target.value)}
        autoComplete="name"
      />
      <TextField
        id="contact"
        label="Հեռախոս կամ Email"
        value={fields.contact}
        onChange={(event) => setField("contact", event.target.value)}
      />
      <TextAreaField
        id="message"
        label="Հաղորդագրություն"
        rows={4}
        value={fields.message}
        onChange={(event) => setField("message", event.target.value)}
      />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Ուղարկվում է..." : "Ուղարկել"}
      </Button>
    </form>
  );
}
