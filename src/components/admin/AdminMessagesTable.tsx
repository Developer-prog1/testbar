"use client";

import { DeleteRowButton } from "@/components/admin/DeleteRowButton";
import { formatDateTimeFull } from "@/lib/datetime";
import type { AdminContactMessage } from "@/lib/types";

interface AdminMessagesTableProps {
  readonly messages: readonly AdminContactMessage[];
}

export function AdminMessagesTable({ messages }: AdminMessagesTableProps) {
  if (messages.length === 0) {
    return <p className="text-sm text-muted">Հաղորդագրություններ դեռ չկան:</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {messages.map((msg) => (
        <li
          key={msg.id}
          className="flex items-start gap-3 rounded-card border border-line bg-panel p-4 sm:gap-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-medium text-cream">{msg.name}</p>
              <p className="text-xs text-gold">{msg.contact}</p>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-cream/90">
              {msg.message}
            </p>
            <p className="mt-2 text-xs text-muted">
              {formatDateTimeFull(msg.createdAt)}
            </p>
          </div>
          <DeleteRowButton
            endpoint={`/api/admin/messages/${msg.id}`}
            label={msg.name}
          />
        </li>
      ))}
    </ul>
  );
}
