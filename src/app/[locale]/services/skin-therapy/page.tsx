import { useTranslations } from "next-intl";

export default function ServiceSkinTherapyPage() {
  const t = useTranslations("ServiceSkinTherapy");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("heading")}</h1>
      <p className="mt-4 text-[var(--color-muted)]">{t("placeholder")}</p>
    </div>
  );
}
