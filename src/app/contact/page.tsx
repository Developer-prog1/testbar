import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Կապ",
  description: "Կապվիր մեզ հետ հարցերի և համագործակցության համար:",
};

export const dynamic = "force-static";

const INFO = [
  { label: "Հասցե", value: "Աբովյան 12, Երևան" },
  { label: "Հեռախոս", value: "+374 10 000 000" },
  { label: "Email", value: "hello@lordblade.am" },
  { label: "Աշխատաժամ", value: "Երկ–Շաբ՝ 10:00–20:00" },
] as const;

export default function ContactPage() {
  return (
    <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Կապ"
          title="Կապ հաստատիր մեզ հետ"
          description="Հարցեր, համագործակցություն կամ ամրագրման օգնություն — գրիր մեզ:"
        />
        <dl className="flex flex-col gap-4">
          {INFO.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between border-b border-line/60 pb-3"
            >
              <dt className="text-sm text-muted">{item.label}</dt>
              <dd className="text-sm text-cream">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ContactForm />
    </Container>
  );
}
