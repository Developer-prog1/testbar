import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Մուտք" };

export default function LoginPage() {
  return (
    <Container className="flex min-h-[70vh] max-w-md flex-col justify-center gap-8 py-16">
      <SectionHeading
        eyebrow="Հաշիվ"
        title="Մուտք գործիր"
        description="Մուտք գործիր որպես խանութի տեր կամ վարսավիր:"
        align="center"
      />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </Container>
  );
}
