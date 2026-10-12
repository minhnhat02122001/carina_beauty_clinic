import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getTreatmentBySlug } from "@/sanity/lib/service";
import { treatmentHref, type TreatmentCategory } from "@/sanity/lib/treatmentCategories";

type LocalizedHref = Parameters<typeof getPathname>[0]["href"];

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
    openGraph: { title: treatment.name, images: treatment.imageUrls.slice(0, 1) },
  };
}
