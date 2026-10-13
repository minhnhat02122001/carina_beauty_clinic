import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { CATEGORY_ROUTES } from "@/components/blog/category-routes";
import { getSitemapContent } from "@/sanity/lib/sitemap";
import { treatmentHref } from "@/sanity/lib/treatmentCategories";

export const revalidate = 3600;

type Href = Parameters<typeof getPathname>[0]["href"];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// One <url> per locale, each listing every language version (itself included), as Google expects.
function localizedEntries(href: Href, lastModified?: string): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, SITE_URL + getPathname({ locale, href })]),
  );
  return routing.locales.map((locale) => ({ url: languages[locale], lastModified, alternates: { languages } }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, doctors, treatments } = await getSitemapContent();
  const staticPaths = Object.keys(routing.pathnames).filter((path) => !path.includes("[")) as Href[];

  return [
    ...staticPaths.flatMap((path) => localizedEntries(path)),
    ...posts.flatMap(({ category, slug, updatedAt }) =>
      localizedEntries({ pathname: CATEGORY_ROUTES[category], params: { slug } }, updatedAt),
    ),
    ...treatments.flatMap(({ category, slug, updatedAt }) =>
      localizedEntries(treatmentHref(category, slug), updatedAt),
    ),
    ...doctors.flatMap(({ slug, updatedAt }) =>
      localizedEntries({ pathname: "/about/[slug]", params: { slug } }, updatedAt),
    ),
  ];
}
