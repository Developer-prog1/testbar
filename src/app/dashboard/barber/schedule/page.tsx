import { prisma } from "@/lib/db";
import { requireBarber } from "@/lib/auth/api";
import { Panel } from "@/components/dashboard/Panel";
import {
  WorkingHoursEditor,
  type DayHours,
} from "@/components/dashboard/barber/WorkingHoursEditor";
import { ServiceDurationsEditor } from "@/components/dashboard/barber/ServiceDurationsEditor";
import { mapDurations } from "@/lib/data/mappers";

const DEFAULT_START = 10 * 60;
const DEFAULT_END = 20 * 60;

export default async function BarberSchedulePage() {
  const { barberId } = await requireBarber();
  const [hours, durations] = await Promise.all([
    prisma.workingHours.findMany({ where: { barberId } }),
    prisma.serviceDuration.findMany({ where: { barberId } }),
  ]);

  const hoursByDay = new Map(hours.map((h) => [h.dayOfWeek, h]));
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
    <div className="flex flex-col gap-6">
      <Panel
        title="Աշխատանքային ժամեր"
        description="Նշիր որ օրերին ու ժամերին ես աշխատում:"
      >
        <WorkingHoursEditor initial={initialHours} />
      </Panel>
      <Panel
        title="Ծառայությունների տևողություն"
        description="Ըստ սրա՝ ամրագրման ժամանակ ճիշտ քանակի ժամեր են փակվում:"
      >
        <ServiceDurationsEditor initial={mapDurations(durations)} />
      </Panel>
    </div>
  );
}
