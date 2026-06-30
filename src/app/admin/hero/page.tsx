import { Panel } from "@/components/dashboard/Panel";
import { HeroManager } from "@/components/admin/HeroManager";
import { listHeroSlides } from "@/lib/data/site";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const slides = await listHeroSlides();

  return (
    <Panel
      title="Hero"
      description="Գլխավոր էջի carousel նկարները — ավելացրու, փոխիր կամ ջնջիր:"
    >
      <HeroManager slides={slides} />
    </Panel>
  );
}
