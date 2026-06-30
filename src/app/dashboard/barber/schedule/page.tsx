import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireBarber } from "@/lib/auth/api";
import { Panel } from "@/components/dashboard/Panel";
import {
  WorkingHoursEditor,
  type DayHours,
} from "@/components/dashboard/barber/WorkingHoursEditor";
import { ServiceDurationsEditor } from "@/components/dashboard/barber/ServiceDurationsEditor";
import {
  TimeBlockManager,
  type TimeBlockDto,
} from "@/components/dashboard/barber/TimeBlockManager";
import { PanelSkeleton } from "@/components/ui/PanelSkeleton";
import { mapDurations } from "@/lib/data/mappers";

const DEFAULT_START = 10 * 60;
const DEFAULT_END = 20 * 60;
const MS_PER_MINUTE = 60_000;

async function WorkingHoursPanel() {
  const { barberId } = await requireBarber();
  const hours = await prisma.workingHours.findMany({ where: { barberId } });
  const hoursByDay = new Map(hours.map((hour) => [hour.dayOfWeek, hour]));
  const initialHours: DayHours[] = Array.from({ length: 7 }, (_, dayOfWeek) => {
    const existing = hoursByDay.get(dayOfWeek);
    return {
      dayOfWeek,
      startMinute: existing?.startMinute ?? DEFAULT_START,
      endMinute: existing?.endMinute ?? DEFAULT_END,
      enabled: existing?.enabled ?? false,
    };
  });

  return (
    <Panel
      title="Աշխատանքային ժամեր"
      description="Նշիր որ օրերին ու ժամերին ես աշխատում:"
    >
      <WorkingHoursEditor initial={initialHours} />
    </Panel>
  );
}

async function TimeBlocksPanel() {
  const { barberId } = await requireBarber();
  const now = Date.now();
  const rawBlocks = await prisma.timeBlock.findMany({
    where: { barberId },
    orderBy: { startsAt: "asc" },
  });

  const blocks: TimeBlockDto[] = rawBlocks
    .filter(
      (block) =>
        block.startsAt.getTime() + block.durationMinutes * MS_PER_MINUTE > now,
    )
    .map((block) => ({
      id: block.id,
      startsAt: block.startsAt.toISOString(),
      durationMinutes: block.durationMinutes,
      note: block.note,
    }));

  return (
    <Panel
      title="Ժամանակավոր փակում"
      description="Փակիր կոնկրետ ժամանակահատվածը, օր.՝ գործեր գնալու կամ ճաշի համար:"
    >
      <TimeBlockManager initial={blocks} />
    </Panel>
  );
}

async function ServiceDurationsPanel() {
  const { barberId } = await requireBarber();
  const durations = await prisma.serviceDuration.findMany({ where: { barberId } });

  return (
    <Panel
      title="Ծառայությունների տևողություն"
      description="Ըստ սրա՝ ամրագրման ժամանակ ճիշտ քանակի ժամեր են փակվում:"
    >
      <ServiceDurationsEditor initial={mapDurations(durations)} />
    </Panel>
  );
}

export default function BarberSchedulePage() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<PanelSkeleton />}>
        <WorkingHoursPanel />
      </Suspense>
      <Suspense fallback={<PanelSkeleton />}>
        <TimeBlocksPanel />
      </Suspense>
      <Suspense fallback={<PanelSkeleton />}>
        <ServiceDurationsPanel />
      </Suspense>
    </div>
  );
}
