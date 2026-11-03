import { client } from "./client";
import type { PostCategory } from "./posts";
import { TREATMENT_CATEGORIES, type TreatmentCategory } from "./treatmentCategories";

type SlugEntry = { slug: string; updatedAt: string };

export type SitemapContent = {
  posts: (SlugEntry & { category: PostCategory })[];
  doctors: SlugEntry[];
  treatments: (SlugEntry & { category: TreatmentCategory })[];
};

const SLUG_PROJECTION = `{ "slug": slug.current, "updatedAt": _updatedAt }`;

// A sitemap must not list pages it also asks Google to drop; every seoRobots option is a noindex one.
// A treatment's categories live on the navigationSettings singleton, not on the treatment itself.
const SITEMAP_QUERY = `{
  "posts": *[_type == "post" && defined(slug.current) && !defined(seoRobots)]{ category, "slug": slug.current, "updatedAt": _updatedAt },
  "doctors": *[_type == "doctor" && defined(slug.current)]${SLUG_PROJECTION},
  "nav": *[_type == "navigationSettings"][0]{
    ${TREATMENT_CATEGORIES.map(({ settingsKey }) => `"${settingsKey}": ${settingsKey}.subgroups[].treatments[]->{ "slug": slug.current, "updatedAt": _updatedAt, seoRobots }`).join(",\n    ")}
  }
}`;

export async function getSitemapContent(): Promise<SitemapContent> {
  const { posts, doctors, nav } = await client.fetch<{
    posts: SitemapContent["posts"];
    doctors: SlugEntry[];
    nav: Record<string, ((SlugEntry & { seoRobots: string | null }) | null)[] | null> | null;
  }>(SITEMAP_QUERY);

  const treatments = TREATMENT_CATEGORIES.flatMap(({ value, settingsKey }) =>
    (nav?.[settingsKey] ?? [])
      .filter((item) => !!item?.slug && !item.seoRobots)
      .map((item) => ({ slug: item!.slug, updatedAt: item!.updatedAt, category: value })),
  );

  return { posts, doctors, treatments };
}
