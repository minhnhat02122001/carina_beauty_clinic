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

// A treatment's categories live on the navigationSettings singleton, not on the treatment itself.
const SITEMAP_QUERY = `{
  "posts": *[_type == "post" && defined(slug.current)]{ category, "slug": slug.current, "updatedAt": _updatedAt },
  "doctors": *[_type == "doctor" && defined(slug.current)]${SLUG_PROJECTION},
  "nav": *[_type == "navigationSettings"][0]{
    ${TREATMENT_CATEGORIES.map(({ settingsKey }) => `"${settingsKey}": ${settingsKey}.subgroups[].treatments[]->${SLUG_PROJECTION}`).join(",\n    ")}
  }
}`;

export async function getSitemapContent(): Promise<SitemapContent> {
  const { posts, doctors, nav } = await client.fetch<{
    posts: SitemapContent["posts"];
    doctors: SlugEntry[];
    nav: Record<string, (SlugEntry | null)[] | null> | null;
  }>(SITEMAP_QUERY);

  const treatments = TREATMENT_CATEGORIES.flatMap(({ value, settingsKey }) =>
    (nav?.[settingsKey] ?? [])
      .filter((item): item is SlugEntry => !!item?.slug)
      .map((item) => ({ ...item, category: value })),
  );

  return { posts, doctors, treatments };
}
