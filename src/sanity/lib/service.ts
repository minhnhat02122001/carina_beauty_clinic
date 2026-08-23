import type { PortableTextBlock } from "@portabletext/react";
import type { Locale } from "@/i18n/routing";
import { client } from "./client";
import { urlFor } from "./image";

export type TreatmentCategory =
  | "exclusive"
  | "lifting-rejuvenation"
  | "skin-therapy"
  | "rejuvenation-injections"
  | "body-care"
  | "skin-care";

export type TreatmentSummary = {
  id: string;
  slug: string;
  name: string;
  subgroup: string | null;
  imageUrl: string | null;
};

export type TreatmentKeyInfo = {
  duration: string | null;
  technology: string | null;
  suitableFor: string | null;
  downtime: string | null;
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
  keyInfo: TreatmentKeyInfo;
  sections: TreatmentSection[];
  faqs: TreatmentFaq[];
  reviewedByDoctor: TreatmentReviewer | null;
  relatedTreatments: TreatmentSummary[];
};

const LOCALIZED_NAME = `select($locale == "vi" => name, $locale == "zh" => coalesce(nameZh, name), coalesce(nameEn, name))`;
const LOCALIZED_BODY = `select($locale == "vi" => description, $locale == "zh" => coalesce(descriptionZh, description), coalesce(descriptionEn, description))`;
const LOCALIZED_SUBGROUP = `select($locale == "vi" => subgroup, $locale == "zh" => coalesce(subgroupZh, subgroup), coalesce(subgroupEn, subgroup))`;
const LOCALIZED_DURATION = `select($locale == "vi" => duration, $locale == "zh" => coalesce(durationZh, duration), coalesce(durationEn, duration))`;
const LOCALIZED_TECHNOLOGY = `select($locale == "vi" => technology, $locale == "zh" => coalesce(technologyZh, technology), coalesce(technologyEn, technology))`;
const LOCALIZED_SUITABLE_FOR = `select($locale == "vi" => suitableFor, $locale == "zh" => coalesce(suitableForZh, suitableFor), coalesce(suitableForEn, suitableFor))`;
const LOCALIZED_DOWNTIME = `select($locale == "vi" => downtime, $locale == "zh" => coalesce(downtimeZh, downtime), coalesce(downtimeEn, downtime))`;
const LOCALIZED_DOCTOR_TITLE = `select($locale == "vi" => title, $locale == "zh" => coalesce(titleZh, title), coalesce(titleEn, title))`;
const LOCALIZED_TREATMENT_SECTIONS = `sections[]{
  "heading": select($locale == "vi" => heading, $locale == "zh" => coalesce(headingZh, heading), coalesce(headingEn, heading)),
  "body": select($locale == "vi" => body, $locale == "zh" => coalesce(bodyZh, body), coalesce(bodyEn, body))
}`;
const LOCALIZED_FAQS = `faqs[]{
  "question": select($locale == "vi" => question, $locale == "zh" => coalesce(questionZh, question), coalesce(questionEn, question)),
  "answer": select($locale == "vi" => answer, $locale == "zh" => coalesce(answerZh, answer), coalesce(answerEn, answer))
}`;

type RawTreatmentSummary = {
  _id: string;
  slug: string;
  name: string;
  subgroup: string | null;
  images: Parameters<typeof urlFor>[0][] | null;
};

function toSummary(item: RawTreatmentSummary): TreatmentSummary {
  const firstImage = item.images?.[0];
  return {
    id: item._id,
    slug: item.slug,
    name: item.name,
    subgroup: item.subgroup,
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

export type TreatmentsByCategory = Partial<Record<TreatmentCategory, TreatmentSummary[]>>;

export function groupTreatmentsBySubgroup(items: TreatmentSummary[]): { subgroup: string | null; items: TreatmentSummary[] }[] {
  const order: (string | null)[] = [];
  const map = new Map<string | null, TreatmentSummary[]>();
  for (const item of items) {
    if (!map.has(item.subgroup)) {
      map.set(item.subgroup, []);
      order.push(item.subgroup);
    }
    map.get(item.subgroup)!.push(item);
  }
  return order.map((subgroup) => ({ subgroup, items: map.get(subgroup)! }));
}

const ALL_TREATMENTS_QUERY = `*[_type == "treatment"] | order(category asc, order asc){
  _id,
  "slug": slug.current,
  "name": ${LOCALIZED_NAME},
  "subgroup": ${LOCALIZED_SUBGROUP},
  category,
  images
}`;

export async function getTreatmentsGroupedByCategory(locale: Locale): Promise<TreatmentsByCategory> {
  const items = await client.fetch<(RawTreatmentSummary & { category: TreatmentCategory })[]>(ALL_TREATMENTS_QUERY, {
    locale,
  });

  const grouped: TreatmentsByCategory = {};
  for (const item of items) {
    (grouped[item.category] ??= []).push(toSummary(item));
  }
  return grouped;
}

const TREATMENTS_BY_CATEGORY_QUERY = `*[_type == "treatment" && category == $category] | order(order asc){
  _id,
  "slug": slug.current,
  "name": ${LOCALIZED_NAME},
  "subgroup": ${LOCALIZED_SUBGROUP},
  images
}`;

export async function getTreatmentsByCategory(category: TreatmentCategory, locale: Locale): Promise<TreatmentSummary[]> {
  const items = await client.fetch<RawTreatmentSummary[]>(TREATMENTS_BY_CATEGORY_QUERY, { category, locale });
  return items.map(toSummary);
}

const TREATMENT_BY_SLUG_QUERY = `*[_type == "treatment" && category == $category && slug.current == $slug][0]{
  "name": ${LOCALIZED_NAME},
  "body": ${LOCALIZED_BODY},
  images,
  "duration": ${LOCALIZED_DURATION},
  "technology": ${LOCALIZED_TECHNOLOGY},
  "suitableFor": ${LOCALIZED_SUITABLE_FOR},
  "downtime": ${LOCALIZED_DOWNTIME},
  "sections": ${LOCALIZED_TREATMENT_SECTIONS},
  "faqs": ${LOCALIZED_FAQS},
  "reviewedByDoctor": reviewedByDoctor->{
    name,
    "title": ${LOCALIZED_DOCTOR_TITLE},
    "slug": slug.current,
    images
  },
  "relatedTreatments": *[_type == "treatment" && category == $category && slug.current != $slug] | order(order asc) [0...4]{
    _id,
    "slug": slug.current,
    "name": ${LOCALIZED_NAME},
    "subgroup": ${LOCALIZED_SUBGROUP},
    images
  }
}`;

export async function getTreatmentBySlug(
  category: TreatmentCategory,
  slug: string,
  locale: Locale,
): Promise<TreatmentDetail | null> {
  const item = await client.fetch<{
    name: string;
    body: PortableTextBlock[] | null;
    images: Parameters<typeof urlFor>[0][] | null;
    duration: string | null;
    technology: string | null;
    suitableFor: string | null;
    downtime: string | null;
    sections: { heading: string | null; body: PortableTextBlock[] | null }[] | null;
    faqs: { question: string | null; answer: string | null }[] | null;
    reviewedByDoctor: {
      name: string;
      title: string;
      slug: string | null;
      images: Parameters<typeof urlFor>[0][] | null;
    } | null;
    relatedTreatments: RawTreatmentSummary[] | null;
  } | null>(TREATMENT_BY_SLUG_QUERY, { category, slug, locale });

  if (!item) return null;

  const reviewerImage = item.reviewedByDoctor?.images?.[0];

  return {
    name: item.name,
    body: item.body ?? [],
    imageUrls: (item.images ?? []).map((image) => urlFor(image).width(1200).height(675).fit("crop").url()),
    keyInfo: {
      duration: item.duration,
      technology: item.technology,
      suitableFor: item.suitableFor,
      downtime: item.downtime,
    },
    sections: (item.sections ?? [])
      .filter((section) => section.heading)
      .map((section) => ({ heading: section.heading as string, body: section.body ?? [] })),
    faqs: (item.faqs ?? [])
      .filter((faq) => faq.question && faq.answer)
      .map((faq) => ({ question: faq.question as string, answer: faq.answer as string })),
    reviewedByDoctor: item.reviewedByDoctor
      ? {
          name: item.reviewedByDoctor.name,
          title: item.reviewedByDoctor.title,
          slug: item.reviewedByDoctor.slug,
          imageUrl:
            reviewerImage && (reviewerImage as { asset?: unknown }).asset
              ? urlFor(reviewerImage).width(160).url()
              : null,
        }
      : null,
    relatedTreatments: (item.relatedTreatments ?? []).map(toSummary),
  };
}

export type ServiceHighlightItem = {
  id: string;
  name: string;
  imageUrl: string;
  categories: string[];
  href: ReturnType<typeof treatmentHref> | null;
};

const SERVICE_HIGHLIGHTS_QUERY = `*[_type == "serviceHighlight"] | order(order asc){
  _id,
  "name": ${LOCALIZED_NAME},
  image,
  categories,
  "treatmentCategory": treatment->category,
  "treatmentSlug": treatment->slug.current
}`;

export async function getServiceHighlights(locale: Locale): Promise<ServiceHighlightItem[]> {
  const items = await client.fetch<
    {
      _id: string;
      name: string;
      image: Parameters<typeof urlFor>[0];
      categories: string[];
      treatmentCategory: TreatmentCategory | null;
      treatmentSlug: string | null;
    }[]
  >(SERVICE_HIGHLIGHTS_QUERY, { locale });

  return items.map((item) => ({
    id: item._id,
    name: item.name,
    imageUrl: urlFor(item.image).width(768).height(768).fit("crop").url(),
    categories: item.categories,
    href:
      item.treatmentCategory && item.treatmentSlug
        ? treatmentHref(item.treatmentCategory, item.treatmentSlug)
        : null,
  }));
}
