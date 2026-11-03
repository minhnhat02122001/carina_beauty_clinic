import { urlFor } from "./image";

export type Seo = {
  title: string | null;
  description: string | null;
  keywords: string | null;
  canonical: string | null;
  robots: string | null;
  imageUrl: string | null;
};

export type RawSeo = Omit<Seo, "imageUrl"> & { image: Parameters<typeof urlFor>[0] | null };

// seoImage is filtered because a field left empty in Studio can come back as a stub with no asset, which
// urlFor() throws on.
//
// No Vietnamese fallback, unlike the other LOCALIZED_* fields: a page missing its own SEO text falls back to its
// own translated title, and a Vietnamese canonical on an English page would tell Google to drop the English page.
const localized = (field: string) => `select($locale == "vi" => ${field}, $locale == "zh" => ${field}Zh, ${field}En)`;

export const SEO_PROJECTION = `"seo": {
    "title": ${localized("seoTitle")},
    "description": ${localized("seoDescription")},
    "keywords": ${localized("seoKeywords")},
    "canonical": ${localized("seoCanonical")},
    "robots": seoRobots,
    "image": select(defined(seoImage.asset) => seoImage)
  }`;

export function toSeo({ image, ...seo }: RawSeo): Seo {
  return { ...seo, imageUrl: image ? urlFor(image).width(1200).height(630).fit("crop").url() : null };
}
