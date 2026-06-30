import { Panel } from "@/components/dashboard/Panel";
import { AdminBarbersTable } from "@/components/admin/AdminBarbersTable";
import { listAdminBarbers } from "@/lib/data/admin";

export const dynamic = "force-dynamic";

export default async function AdminBarbersPage() {
  const barbers = await listAdminBarbers();

  return (
    <Panel title="Վարսավիրներ" description="Կառավարիր վարսավիրներին՝ կարգավիճակ և ջնջում:">
      <AdminBarbersTable barbers={barbers} />
    </Panel>
  );
}
