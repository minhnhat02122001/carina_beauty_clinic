import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getTreatmentBySlug } from "@/sanity/lib/service";
import { treatmentHref, type TreatmentCategory } from "@/sanity/lib/treatmentCategories";
import { CLINIC_NAME } from "@/lib/clinic";

type LocalizedHref = Parameters<typeof getPathname>[0]["href"];

const OG_LOCALES: Record<Locale, string> = { vi: "vi_VN", en: "en_US", zh: "zh_CN" };

// Next fills og:title/og:description from the page's own title/description only while the page leaves
// `openGraph` unset. A page that sets it replaces the whole object, so spread this in to keep the
// fallback image, url and locale.
export function baseOpenGraph(locale: Locale): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    siteName: CLINIC_NAME,
    locale: OG_LOCALES[locale],
    url: "./",
    images: [{ url: "/images/og/og-default.jpg", width: 1200, height: 630, alt: CLINIC_NAME }],
  };
}

// Builds canonical + hreflang alternates for a route that exists across all
// locales — every locale maps to the same underlying content (with Vietnamese
// fallback where a translation is missing), so all of them are valid targets.
export function localizedAlternates(locale: Locale, href: LocalizedHref): Metadata["alternates"] {
  const languages = Object.fromEntries(routing.locales.map((loc) => [loc, getPathname({ locale: loc, href })]));

  return {
    canonical: getPathname({ locale, href }),
    languages: { ...languages, "x-default": getPathname({ locale: routing.defaultLocale, href }) },
  };
}

export async function headingMetadata(
  params: Promise<{ locale: Locale }>,
  namespace: string,
  href: LocalizedHref,
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace });
  return { title: t("heading"), alternates: localizedAlternates(locale, href) };
}

export async function treatmentMetadata(
  params: Promise<{ locale: Locale; slug: string }>,
  category: TreatmentCategory,
): Promise<Metadata> {
  const { locale, slug } = await params;
  const treatment = await getTreatmentBySlug(category, slug, locale);
  if (!treatment) return {};

  return {
    title: treatment.name,
    alternates: localizedAlternates(locale, treatmentHref(category, slug)),
    openGraph: {
      ...baseOpenGraph(locale),
      title: treatment.name,
      ...(treatment.imageUrls.length > 0 && { images: treatment.imageUrls.slice(0, 1) }),
    },
  };
}
