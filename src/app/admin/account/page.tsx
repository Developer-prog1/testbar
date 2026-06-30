import { Panel } from "@/components/dashboard/Panel";
import { ChangePasswordForm } from "@/components/dashboard/ChangePasswordForm";
import { DeleteAccountButton } from "@/components/dashboard/DeleteAccountButton";

export default function AdminAccountPage() {
  return (
    <div className="flex flex-col gap-6">
      <Panel title="Գաղտնաբառ" description="Թարմացրու մուտքի գաղտնաբառը:">
        <ChangePasswordForm />
      </Panel>
      <Panel
        title="Վտանգավոր գոտի"
        description="Ադմին հաշվի ջնջումն անվերադարձ է:"
      >
        <DeleteAccountButton />
      </Panel>
    </div>
  );
}
