import { Panel } from "@/components/dashboard/Panel";
import { DeleteShopButton } from "@/components/dashboard/owner/DeleteShopButton";

export default function OwnerSettingsPage() {
  return (
    <Panel
      title="Վտանգավոր գոտի"
      description="Խանութի ջնջումը հեռացնում է էջը, վարսավիրների կապերն ու ամրագրումները:"
    >
      <DeleteShopButton />
    </Panel>
  );
}
