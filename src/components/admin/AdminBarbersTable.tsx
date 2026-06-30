import Image from "next/image";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { DeleteRowButton } from "@/components/admin/DeleteRowButton";
import type { AdminBarberRow } from "@/lib/types";

interface AdminBarbersTableProps {
  readonly barbers: readonly AdminBarberRow[];
  readonly onChanged?: () => void;
}

export function AdminBarbersTable({ barbers, onChanged }: AdminBarbersTableProps) {
  if (barbers.length === 0) {
    return <p className="text-sm text-muted">Վարսավիրներ դեռ չկան:</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {barbers.map((barber) => {
        const fullName = `${barber.firstName} ${barber.lastName}`.trim();
        const endpoint = `/api/admin/barbers/${barber.id}`;
        return (
          <li
            key={barber.id}
            className="flex items-center gap-3 rounded-card border border-line bg-panel p-3 sm:gap-4"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
              <Image
                src={barber.photoUrl}
                alt={fullName || barber.email}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-cream">{fullName || "—"}</p>
              <p className="truncate text-xs text-muted">{barber.email}</p>
              <p className="truncate text-xs text-muted">{barber.phone || "—"}</p>
            </div>
            <StatusToggle
              endpoint={endpoint}
              status={barber.status}
              onChanged={onChanged}
            />
            <DeleteRowButton
              endpoint={endpoint}
              label={fullName || barber.email}
              onChanged={onChanged}
            />
          </li>
        );
      })}
    </ul>
  );
}
