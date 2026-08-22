import type { PortableTextBlock } from "@portabletext/react";
import type { Locale } from "@/i18n/routing";
import { client } from "./client";
import { urlFor } from "./image";

const LOCALIZED_TITLE = `select($locale == "vi" => title, $locale == "zh" => coalesce(titleZh, title), coalesce(titleEn, title))`;
const LOCALIZED_SUBTITLE = `select($locale == "vi" => subtitle, $locale == "zh" => coalesce(subtitleZh, subtitle), coalesce(subtitleEn, subtitle))`;
const LOCALIZED_NATIONALITY = `select($locale == "vi" => nationality, $locale == "zh" => coalesce(nationalityZh, nationality), coalesce(nationalityEn, nationality))`;
const LOCALIZED_INTRODUCTION = `select($locale == "vi" => introduction, $locale == "zh" => coalesce(introductionZh, introduction), coalesce(introductionEn, introduction))`;
const LOCALIZED_SECTIONS = `sections[]{
  "heading": select($locale == "vi" => heading, $locale == "zh" => coalesce(headingZh, heading), coalesce(headingEn, heading)),
  "body": select($locale == "vi" => body, $locale == "zh" => coalesce(bodyZh, body), coalesce(bodyEn, body))
}`;

export type DoctorItem = {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  slug: string | null;
};

export type DoctorSection = {
  heading: string;
  body: PortableTextBlock[];
};

export type DoctorDetail = {
  name: string;
  title: string;
  subtitle: string | null;
  nationality: string | null;
  imageUrl: string;
  introduction: PortableTextBlock[];
  sections: DoctorSection[];
  clinicalImageUrls: string[];
};

const DOCTORS_QUERY = `*[_type == "doctor"] | order(order asc){
  _id,
  name,
  "title": ${LOCALIZED_TITLE},
  "slug": slug.current,
  image
}`;

export async function getDoctors(locale: Locale): Promise<DoctorItem[]> {
  const doctors = await client.fetch<
    { _id: string; name: string; title: string; slug: string | null; image: Parameters<typeof urlFor>[0] }[]
  >(DOCTORS_QUERY, { locale });

  return doctors.map((item) => ({
    id: item._id,
    name: item.name,
    title: item.title,
    imageUrl: urlFor(item.image).width(590).height(738).fit("crop").url(),
    slug: item.slug ?? null,
  }));
}

const DOCTOR_BY_SLUG_QUERY = `*[_type == "doctor" && slug.current == $slug][0]{
  name,
  "title": ${LOCALIZED_TITLE},
  "subtitle": ${LOCALIZED_SUBTITLE},
  "nationality": ${LOCALIZED_NATIONALITY},
  "introduction": ${LOCALIZED_INTRODUCTION},
  "sections": ${LOCALIZED_SECTIONS},
  image,
  clinicalImages
}`;

export async function getDoctorBySlug(slug: string, locale: Locale): Promise<DoctorDetail | null> {
  const item = await client.fetch<{
    name: string;
    title: string;
    subtitle: string | null;
    nationality: string | null;
    introduction: PortableTextBlock[] | null;
    sections: { heading: string | null; body: PortableTextBlock[] | null }[] | null;
    image: Parameters<typeof urlFor>[0];
    clinicalImages: Parameters<typeof urlFor>[0][] | null;
  } | null>(DOCTOR_BY_SLUG_QUERY, { slug, locale });

  if (!item) return null;

  return {
    name: item.name,
    title: item.title,
    subtitle: item.subtitle,
    nationality: item.nationality,
    imageUrl: urlFor(item.image).width(590).height(738).fit("crop").url(),
    introduction: item.introduction ?? [],
    sections: (item.sections ?? [])
      .filter((section) => section.heading)
      .map((section) => ({ heading: section.heading as string, body: section.body ?? [] })),
    clinicalImageUrls: (item.clinicalImages ?? []).map((image) => urlFor(image).width(800).height(600).fit("crop").url()),
  };
}
