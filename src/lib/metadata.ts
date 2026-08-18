import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

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
