import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getTreatmentsByCategory } from "@/sanity/lib/service";
import { TreatmentList } from "@/components/treatments/treatment-list";

export default async function ServiceBodyCarePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [t, treatments] = await Promise.all([
    getTranslations("ServiceBodyCare"),
    getTreatmentsByCategory("body-care", locale),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10 lg:py-16">
      <h1 className="text-2xl font-semibold text-[var(--color-accent)] lg:text-4xl">{t("heading")}</h1>
      <div className="mt-8">
        <TreatmentList
          treatments={treatments}
          emptyLabel={t("empty")}
          getHref={(slug) => ({ pathname: "/services/body-care/[slug]", params: { slug } })}
        />
      </div>
    </div>
  );
}
