import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { headingMetadata } from "@/lib/metadata";

export const generateMetadata = ({ params }: { params: Promise<{ locale: Locale }> }) =>
  headingMetadata(params, "Gallery", "/gallery");

export default function GalleryPage() {
  const t = useTranslations("Gallery");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("heading")}</h1>
      <p className="mt-4 text-[var(--color-muted)]">{t("placeholder")}</p>
    </div>
  );
}
