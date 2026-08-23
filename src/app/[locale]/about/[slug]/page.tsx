import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getDoctorBySlug } from "@/sanity/lib/doctors";
import { DoctorDetailView } from "@/components/doctors/doctor-detail";

export default async function DoctorDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const [t, doctor] = await Promise.all([getTranslations("DoctorDetail"), getDoctorBySlug(slug, locale)]);

  if (!doctor) notFound();

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link href="/about" className="mt-8 inline-block text-sm font-bold text-[var(--color-link)]">
          {t("backToList")}
        </Link>
      </div>
      <DoctorDetailView
        doctor={doctor}
        bookingLabel={t("bookingCta")}
        extraInformationLabel={t("extraInformation")}
        realCustomerImagesLabel={t("realCustomerImages")}
        internationalActivitiesLabel={t("internationalActivities")}
        comingSoonLabel={t("comingSoon")}
        scrollPrevLabel={t("scrollPrev")}
        scrollNextLabel={t("scrollNext")}
      />
    </div>
  );
}
