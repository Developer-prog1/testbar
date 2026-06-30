import { Panel } from "@/components/dashboard/Panel";
import { AdminMessagesTable } from "@/components/admin/AdminMessagesTable";
import { listAdminMessages } from "@/lib/data/site";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await listAdminMessages();

  return (
    <Panel
      title="Հաղորդագրություններ"
      description="Կապի ձևից (/contact) ստացված հաղորդագրություններ:"
    >
      <AdminMessagesTable messages={messages} />
    </Panel>
  );
}
