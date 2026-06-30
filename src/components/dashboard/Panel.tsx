"use client";

import type { ReactNode } from "react";

interface PanelProps {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
}

export function Panel({ title, description, children }: PanelProps) {
  return (
    <section className="rounded-card border border-line bg-panel p-5 sm:p-6">
      <header className="mb-4 flex flex-col gap-1">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
