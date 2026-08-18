import type { PortableTextBlock } from "@portabletext/react";
import type { Locale } from "@/i18n/routing";
import { client } from "./client";
import { urlFor } from "./image";

export type PostCategory = "newsEvents" | "promotions" | "beautyKnowledge";

export type FeaturedNewsItem = {
  id: string;
  title: string;
  date: string;
  imageUrl: string | null;
};

export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string | null;
};

export type PostDetail = {
  title: string;
  excerpt: string;
  body: PortableTextBlock[];
  date: string;
  publishedAtISO: string;
  imageUrl: string | null;
  tags: string[];
};

const DATE_LOCALES: Record<Locale, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
};

function formatDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(DATE_LOCALES[locale], { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(iso),
  );
}

const LOCALIZED_TITLE = `select($locale == "vi" => title, $locale == "zh" => coalesce(titleZh, title), coalesce(titleEn, title))`;
const LOCALIZED_EXCERPT = `select($locale == "vi" => excerpt, $locale == "zh" => coalesce(excerptZh, excerpt), coalesce(excerptEn, excerpt))`;
const LOCALIZED_BODY = `select($locale == "vi" => body, $locale == "zh" => coalesce(bodyZh, body), coalesce(bodyEn, body))`;

const FEATURED_NEWS_QUERY = `*[_type == "post" && category == "newsEvents" && featured == true] | order(publishedAt desc)[0...3]{
  _id,
  "title": ${LOCALIZED_TITLE},
  coverImage,
  publishedAt
}`;

export async function getFeaturedNews(locale: Locale): Promise<FeaturedNewsItem[]> {
  const posts = await client.fetch<
    { _id: string; title: string; coverImage: Parameters<typeof urlFor>[0] | null; publishedAt: string }[]
  >(FEATURED_NEWS_QUERY, { locale });

  return posts.map((post) => ({
    id: post._id,
    title: post.title,
    date: formatDate(locale, post.publishedAt),
    imageUrl: post.coverImage ? urlFor(post.coverImage).width(760).height(434).fit("crop").url() : null,
  }));
}

const POSTS_BY_CATEGORY_QUERY = `*[_type == "post" && category == $category] | order(publishedAt desc){
  _id,
  "slug": slug.current,
  "title": ${LOCALIZED_TITLE},
  "excerpt": ${LOCALIZED_EXCERPT},
  coverImage,
  publishedAt
}`;

export async function getPostsByCategory(category: PostCategory, locale: Locale): Promise<PostSummary[]> {
  const posts = await client.fetch<
    {
      _id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      coverImage: Parameters<typeof urlFor>[0] | null;
      publishedAt: string;
    }[]
  >(POSTS_BY_CATEGORY_QUERY, { category, locale });

  return posts.map((post) => ({
    id: post._id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    date: formatDate(locale, post.publishedAt),
    imageUrl: post.coverImage ? urlFor(post.coverImage).width(760).height(434).fit("crop").url() : null,
  }));
}

const POST_BY_SLUG_QUERY = `*[_type == "post" && category == $category && slug.current == $slug][0]{
  "title": ${LOCALIZED_TITLE},
  "excerpt": ${LOCALIZED_EXCERPT},
  "body": ${LOCALIZED_BODY},
  coverImage,
  publishedAt,
  tags
}`;

export async function getPostBySlug(category: PostCategory, slug: string, locale: Locale): Promise<PostDetail | null> {
  const post = await client.fetch<{
    title: string;
    excerpt: string | null;
    body: PortableTextBlock[] | null;
    coverImage: Parameters<typeof urlFor>[0] | null;
    publishedAt: string;
    tags: string[] | null;
  } | null>(POST_BY_SLUG_QUERY, { category, slug, locale });

  if (!post) return null;

  return {
    title: post.title,
    excerpt: post.excerpt ?? "",
    body: post.body ?? [],
    date: formatDate(locale, post.publishedAt),
    publishedAtISO: post.publishedAt,
    imageUrl: post.coverImage ? urlFor(post.coverImage).width(1200).height(675).fit("crop").url() : null,
    tags: post.tags ?? [],
  };
}

export type BeautyKnowledgeHome = {
  hero: PostSummary | null;
  thumbnails: PostSummary[];
};

const BEAUTY_KNOWLEDGE_HOME_QUERY = `*[_type == "post" && category == "beautyKnowledge"] | order(publishedAt desc)[0...5]{
  _id,
  "slug": slug.current,
  "title": ${LOCALIZED_TITLE},
  "excerpt": ${LOCALIZED_EXCERPT},
  coverImage,
  publishedAt
}`;

export async function getBeautyKnowledgeHome(locale: Locale): Promise<BeautyKnowledgeHome> {
  const posts = await client.fetch<
    {
      _id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      coverImage: Parameters<typeof urlFor>[0] | null;
      publishedAt: string;
    }[]
  >(BEAUTY_KNOWLEDGE_HOME_QUERY, { locale });

  const items = posts.map((post) => ({
    id: post._id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    date: formatDate(locale, post.publishedAt),
    imageUrl: post.coverImage ? urlFor(post.coverImage).width(760).height(434).fit("crop").url() : null,
  }));

  const [hero, ...thumbnails] = items;
  return { hero: hero ?? null, thumbnails };
}
