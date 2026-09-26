import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/metadata";
import { getAboutSettings } from "@/sanity/lib/about";
import { getDoctorProfiles } from "@/sanity/lib/doctors";
import { WhyChooseUs } from "../_home-sections/why-choose-us";
import { RegistrationForm } from "../_home-sections/registration-form";
import { BannerBlock } from "./_sections/banner-block";
import { Closing } from "./_sections/closing";
import { DoctorProfiles } from "./_sections/doctor-profiles";
import { Intro } from "./_sections/intro";
import { Luxury } from "./_sections/luxury";
import { Press } from "./_sections/press";
import { Technology } from "./_sections/technology";
import { Testimonials } from "./_sections/testimonials";

// The wide banners are static files, not Sanity uploads — the client drops the
// final artwork at these paths and nothing else changes. Each slot needs two
// crops (see BannerImage). All four below are temporary stand-ins today, as is
// Technology's own pair.
const SPACE_BANNER = "/images/about/space-banner-desktop.png";
const SPACE_BANNER_MOBILE = "/images/about/space-banner-mobile.png";
const DOCTOR_CUSTOMER_BANNER = "/images/about/doctor-customer-banner-desktop.png";
const DOCTOR_CUSTOMER_BANNER_MOBILE = "/images/about/doctor-customer-banner-mobile.png";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("heading"),
    description: t("metaDescription"),
    alternates: localizedAlternates(locale, "/about"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [doctors, about, t] = await Promise.all([
    getDoctorProfiles(locale),
    getAboutSettings(locale),
    getTranslations({ locale, namespace: "About" }),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <Intro videoId={about.introVideoId} thumbnailUrl={about.introVideoThumbnailUrl} />
      <Luxury />
      <WhyChooseUs />
      <Technology images={about.technologyImages} />
      <DoctorProfiles doctors={doctors} />
      <BannerBlock
        heading={t("privacyHeading")}
        lines={[t("privacyLine1"), t("privacyLine2")]}
        imageUrl={SPACE_BANNER}
        mobileImageUrl={SPACE_BANNER_MOBILE}
        imageAlt={t("privacyBannerAlt")}
      />
      <BannerBlock
        lines={[t("personalizedLine1"), t("personalizedLine2")]}
        imageUrl={DOCTOR_CUSTOMER_BANNER}
        mobileImageUrl={DOCTOR_CUSTOMER_BANNER_MOBILE}
        imageAlt={t("personalizedBannerAlt")}
        altBackground
      />
      <Testimonials images={about.testimonialImages} />
      <Press mentions={about.pressMentions} />
      <Closing images={about.closingImages} />
      <RegistrationForm />
    </div>
  );
}
