import { Panel } from "@/components/dashboard/Panel";
import { AdminShopsTable } from "@/components/admin/AdminShopsTable";
import { listAdminShops } from "@/lib/data/admin";

export const dynamic = "force-dynamic";

export default async function AdminShopsPage() {
  const shops = await listAdminShops();

  return (
    <Panel title="Խանութներ" description="Կառավարիր barber shop-երը՝ կարգավիճակ և ջնջում:">
      <AdminShopsTable shops={shops} />
    </Panel>
  );
}
