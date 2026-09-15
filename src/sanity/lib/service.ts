import type { PortableTextBlock } from "@portabletext/react";
import type { Locale } from "@/i18n/routing";
import { categoryToSettingsKey, type TreatmentCategory } from "./treatmentCategories";
import { client } from "./client";
import { urlFor } from "./image";

export type { TreatmentCategory } from "./treatmentCategories";

export type TreatmentSummary = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
};

export type TreatmentSubgroupGroup = {
  subgroup: string | null;
  items: TreatmentSummary[];
};

export type TreatmentCriterion = {
  label: string;
  value: string;
};

export type TreatmentSection = {
  heading: string;
  body: PortableTextBlock[];
};

export type TreatmentFaq = {
  question: string;
  answer: string;
};

export type TreatmentReviewer = {
  name: string;
  title: string;
  imageUrl: string | null;
  slug: string | null;
};

export type TreatmentDetail = {
  name: string;
  body: PortableTextBlock[];
  imageUrls: string[];
  keyInfo: TreatmentCriterion[];
  sections: TreatmentSection[];
  faqs: TreatmentFaq[];
  reviewedByDoctors: TreatmentReviewer[];
  relatedTreatments: TreatmentSummary[];
};

const LOCALIZED_NAME = `select($locale == "vi" => name, $locale == "zh" => coalesce(nameZh, name), coalesce(nameEn, name))`;
const LOCALIZED_BODY = `select($locale == "vi" => description, $locale == "zh" => coalesce(descriptionZh, description), coalesce(descriptionEn, description))`;
const LOCALIZED_SUBGROUP_LABEL = `select($locale == "vi" => label, $locale == "zh" => coalesce(labelZh, label), coalesce(labelEn, label))`;
const LOCALIZED_KEY_INFO = `keyInfo[]{
  "label": select($locale == "vi" => label, $locale == "zh" => coalesce(labelZh, label), coalesce(labelEn, label)),
  "value": select($locale == "vi" => value, $locale == "zh" => coalesce(valueZh, value), coalesce(valueEn, value))
}`;
const LOCALIZED_DOCTOR_TITLE = `select($locale == "vi" => title, $locale == "zh" => coalesce(titleZh, title), coalesce(titleEn, title))`;
const LOCALIZED_TREATMENT_SECTIONS = `sections[]{
  "heading": select($locale == "vi" => heading, $locale == "zh" => coalesce(headingZh, heading), coalesce(headingEn, heading)),
  "body": select($locale == "vi" => body, $locale == "zh" => coalesce(bodyZh, body), coalesce(bodyEn, body))
}`;
const LOCALIZED_FAQS = `faqs[]{
  "question": select($locale == "vi" => question, $locale == "zh" => coalesce(questionZh, question), coalesce(questionEn, question)),
  "answer": select($locale == "vi" => answer, $locale == "zh" => coalesce(answerZh, answer), coalesce(answerEn, answer))
}`;

export type RawTreatmentSummary = {
  _id: string;
  slug: string;
  name: string;
  images: Parameters<typeof urlFor>[0][] | null;
};

export function toSummary(item: RawTreatmentSummary): TreatmentSummary {
  const firstImage = item.images?.[0];
  return {
    id: item._id,
    slug: item.slug,
    name: item.name,
    imageUrl: firstImage ? urlFor(firstImage).width(400).height(400).fit("crop").url() : null,
  };
}

export function treatmentHref(category: TreatmentCategory, slug: string) {
  switch (category) {
    case "exclusive":
      return { pathname: "/services/exclusive/[slug]", params: { slug } } as const;
    case "lifting-rejuvenation":
      return { pathname: "/services/lifting-rejuvenation/[slug]", params: { slug } } as const;
    case "skin-therapy":
      return { pathname: "/services/skin-therapy/[slug]", params: { slug } } as const;
    case "rejuvenation-injections":
      return { pathname: "/services/rejuvenation-injections/[slug]", params: { slug } } as const;
    case "body-care":
      return { pathname: "/services/body-care/[slug]", params: { slug } } as const;
    case "skin-care":
      return { pathname: "/services/skin-care/[slug]", params: { slug } } as const;
  }
}

export function categoryRootHref(category: TreatmentCategory) {
  switch (category) {
    case "exclusive":
      return "/services/exclusive" as const;
    case "lifting-rejuvenation":
      return "/services/lifting-rejuvenation" as const;
    case "skin-therapy":
      return "/services/skin-therapy" as const;
    case "rejuvenation-injections":
      return "/services/rejuvenation-injections" as const;
    case "body-care":
      return "/services/body-care" as const;
    case "skin-care":
      return "/services/skin-care" as const;
  }
}

// Category membership/order/subgrouping now lives entirely on the
// navigationSettings singleton (src/sanity/lib/nav.ts) — a treatment document
// no longer knows which categories it belongs to. Field names can't be
// parameterized in GROQ, so the (fixed, code-controlled) settings key is
// interpolated directly into the query text rather than passed as a $param.
function categorySubgroupsQuery(settingsKey: string) {
  return `*[_type == "navigationSettings"][0].${settingsKey}.subgroups[]{
    "subgroup": ${LOCALIZED_SUBGROUP_LABEL},
    "items": treatments[]->{
      _id,
      "slug": slug.current,
      "name": ${LOCALIZED_NAME},
      images
    }
  }`;
}

type RawSubgroupGroup = { subgroup: string | null; items: RawTreatmentSummary[] };

export async function getTreatmentsByCategory(category: TreatmentCategory, locale: Locale): Promise<TreatmentSubgroupGroup[]> {
  const groups = await client.fetch<RawSubgroupGroup[]>(categorySubgroupsQuery(categoryToSettingsKey(category)), {
    locale,
  });
  return groups.map((group) => ({ subgroup: group.subgroup, items: group.items.map(toSummary) }));
}

export type ServiceOption = {
  /** Vietnamese name, so HubSpot receives the same value whichever locale the visitor used. */
  value: string;
  label: string;
};

const SERVICE_OPTIONS_QUERY = `*[_type == "treatment" && defined(name)]{
  "value": name,
  "label": ${LOCALIZED_NAME}
}`;

export async function getServiceOptions(locale: Locale): Promise<ServiceOption[]> {
  const options = await client.fetch<ServiceOption[]>(SERVICE_OPTIONS_QUERY, { locale });
  const unique = new Map(options.map((option) => [option.value, option]));
  return [...unique.values()].sort((a, b) => a.label.localeCompare(b.label, locale));
}

const TREATMENT_BY_SLUG_QUERY =`*[_type == "treatment" && slug.current == $slug][0]{
  _id,
  "name": ${LOCALIZED_NAME},
  "body": ${LOCALIZED_BODY},
  images,
  "keyInfo": ${LOCALIZED_KEY_INFO},
  "sections": ${LOCALIZED_TREATMENT_SECTIONS},
  "faqs": ${LOCALIZED_FAQS},
  "reviewedByDoctors": reviewedByDoctors[]->{
    name,
    "title": ${LOCALIZED_DOCTOR_TITLE},
    "slug": slug.current,
    images
  }
}`;

export async function getTreatmentBySlug(
  category: TreatmentCategory,
  slug: string,
  locale: Locale,
): Promise<TreatmentDetail | null> {
  const [item, groups] = await Promise.all([
    client.fetch<{
      _id: string;
      name: string;
      body: PortableTextBlock[] | null;
      images: Parameters<typeof urlFor>[0][] | null;
      keyInfo: { label: string | null; value: string | null }[] | null;
      sections: { heading: string | null; body: PortableTextBlock[] | null }[] | null;
      faqs: { question: string | null; answer: string | null }[] | null;
      reviewedByDoctors: {
        name: string;
        title: string;
        slug: string | null;
        images: Parameters<typeof urlFor>[0][] | null;
      }[] | null;
    } | null>(TREATMENT_BY_SLUG_QUERY, { slug, locale }),
    client.fetch<RawSubgroupGroup[]>(categorySubgroupsQuery(categoryToSettingsKey(category)), { locale }),
  ]);

  if (!item) return null;

  // Confirms this slug is actually placed under this category in
  // navigationSettings (not just that a treatment with this slug exists
  // somewhere) — otherwise e.g. /services/body-care/<skin-therapy-slug>
  // would incorrectly resolve.
  const categoryItems = groups.flatMap((group) => group.items);
  if (!categoryItems.some((sibling) => sibling._id === item._id)) return null;

  return {
    name: item.name,
    body: item.body ?? [],
    imageUrls: (item.images ?? []).map((image) => urlFor(image).width(1200).url()),
    keyInfo: (item.keyInfo ?? [])
      .filter((criterion) => criterion.label && criterion.value)
      .map((criterion) => ({ label: criterion.label as string, value: criterion.value as string })),
    sections: (item.sections ?? [])
      .filter((section) => section.heading)
      .map((section) => ({ heading: section.heading as string, body: section.body ?? [] })),
    faqs: (item.faqs ?? [])
      .filter((faq) => faq.question && faq.answer)
      .map((faq) => ({ question: faq.question as string, answer: faq.answer as string })),
    reviewedByDoctors: (item.reviewedByDoctors ?? []).map((doctor) => {
      const reviewerImage = doctor.images?.[0];
      return {
        name: doctor.name,
        title: doctor.title,
        slug: doctor.slug,
        imageUrl:
          reviewerImage && (reviewerImage as { asset?: unknown }).asset
            ? urlFor(reviewerImage).width(160).url()
            : null,
      };
    }),
    relatedTreatments: categoryItems
      .filter((sibling) => sibling._id !== item._id)
      .slice(0, 4)
      .map(toSummary),
  };
}

