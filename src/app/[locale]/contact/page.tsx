import { RegistrationForm } from "@/components/registration-form/registration-form";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Nav" });
  return { title: t("contact"), alternates: localizedAlternates(locale, "/contact") };
}

export default function ContactPage() {
  return <RegistrationForm />;
}
