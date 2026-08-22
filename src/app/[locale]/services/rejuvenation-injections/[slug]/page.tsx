import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getTreatmentBySlug } from "@/sanity/lib/service";
import { TreatmentDetailView } from "@/components/treatments/treatment-detail";

export default async function RejuvenationInjectionsTreatmentDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [t, treatment] = await Promise.all([
    getTranslations("ServiceRejuvenationInjections"),
    getTreatmentBySlug("rejuvenation-injections", slug, locale),
  ]);

  if (!treatment) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <Link
        href="/services/rejuvenation-injections"
        className="mt-8 inline-block text-sm font-bold text-[var(--color-link)]"
      >
        {t("backToList")}
      </Link>
      <TreatmentDetailView treatment={treatment} comingSoonLabel={t("comingSoon")} />
    </div>
  );
}
