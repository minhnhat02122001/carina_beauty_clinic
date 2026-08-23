import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getTreatmentBySlug } from "@/sanity/lib/service";
import { TreatmentDetailView } from "@/components/treatments/treatment-detail";

export default async function SkinTherapyTreatmentDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [t, tNav, tDetail, treatment] = await Promise.all([
    getTranslations("ServiceSkinTherapy"),
    getTranslations("Nav"),
    getTranslations("TreatmentDetail"),
    getTreatmentBySlug("skin-therapy", slug, locale),
  ]);

  if (!treatment) notFound();

  return (
    <TreatmentDetailView
      treatment={treatment}
      category="skin-therapy"
      comingSoonLabel={t("comingSoon")}
      homeLabel={tNav("home")}
      categoryLabel={t("heading")}
      durationLabel={tDetail("durationLabel")}
      technologyLabel={tDetail("technologyLabel")}
      suitableForLabel={tDetail("suitableForLabel")}
      downtimeLabel={tDetail("downtimeLabel")}
      reviewedByLabel={tDetail("reviewedByLabel")}
      faqHeading={tDetail("faqHeading")}
      relatedHeading={tDetail("relatedHeading")}
      bookingCta={tDetail("bookingCta")}
      scrollPrevLabel={tDetail("scrollPrev")}
      scrollNextLabel={tDetail("scrollNext")}
    />
  );
}
