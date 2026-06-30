import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Գրանցում" };

export default function RegisterPage() {
  return (
    <Container className="flex min-h-[70vh] max-w-lg flex-col justify-center gap-8 py-16">
      <SectionHeading
        eyebrow="Հաշիվ"
        title="Ստեղծիր հաշիվ"
        description="Գրանցվիր որպես barber shop-ի տեր կամ վարսավիր:"
        align="center"
      />
      <RegisterForm />
    </Container>
  );
}
