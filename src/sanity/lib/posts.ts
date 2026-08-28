import type { PortableTextBlock } from "@portabletext/react";
import type { Locale } from "@/i18n/routing";
import { client } from "./client";
import { urlFor } from "./image";

type SanityImageRef = Parameters<typeof urlFor>[0];

export type PostCategory = "newsEvents" | "promotions" | "beautyKnowledge";

export type FeaturedNewsItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  imageUrl: string | null;
};

export type PostSummary = {
  id: string;
  slug: string;
  category: PostCategory;
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

type RawPostSummary = {
  _id: string;
  slug: string;
  category: PostCategory;
  title: string;
  excerpt: string | null;
  coverImage: Parameters<typeof urlFor>[0] | null;
  publishedAt: string;
};

function toSummary(post: RawPostSummary, locale: Locale): PostSummary {
  return {
    id: post._id,
    slug: post.slug,
    category: post.category,
    title: post.title,
    excerpt: post.excerpt ?? "",
    date: formatDate(locale, post.publishedAt),
    imageUrl: post.coverImage ? urlFor(post.coverImage).width(760).height(434).fit("crop").url() : null,
  };
}

const POST_SUMMARY_PROJECTION = `{
  _id,
  "slug": slug.current,
  category,
  "title": ${LOCALIZED_TITLE},
  "excerpt": ${LOCALIZED_EXCERPT},
  coverImage,
  publishedAt
}`;

const FEATURED_NEWS_LIMIT = 6;
const FEATURED_NEWS_QUERY = `*[_type == "post" && category == "newsEvents" && featured == true] | order(publishedAt desc)[0...${FEATURED_NEWS_LIMIT}]{
  _id,
  "slug": slug.current,
  "title": ${LOCALIZED_TITLE},
  coverImage,
  publishedAt
}`;

export async function getFeaturedNews(locale: Locale): Promise<FeaturedNewsItem[]> {
  const posts = await client.fetch<
    { _id: string; slug: string; title: string; coverImage: Parameters<typeof urlFor>[0] | null; publishedAt: string }[]
  >(FEATURED_NEWS_QUERY, { locale });

  return posts.map((post) => ({
    id: post._id,
    slug: post.slug,
    title: post.title,
    date: formatDate(locale, post.publishedAt),
    imageUrl: post.coverImage ? urlFor(post.coverImage).width(760).height(434).fit("crop").url() : null,
  }));
}

const POSTS_BY_CATEGORY_QUERY = `*[_type == "post" && category == $category] | order(publishedAt desc)${POST_SUMMARY_PROJECTION}`;

export async function getPostsByCategory(category: PostCategory, locale: Locale): Promise<PostSummary[]> {
  const posts = await client.fetch<RawPostSummary[]>(POSTS_BY_CATEGORY_QUERY, { category, locale });
  return posts.map((post) => toSummary(post, locale));
}

const RELATED_POSTS_LIMIT = 6;
const RELATED_POSTS_QUERY = `*[_type == "post" && category == $category && slug.current != $excludeSlug] | order(publishedAt desc)[0...${RELATED_POSTS_LIMIT}]${POST_SUMMARY_PROJECTION}`;

export async function getRelatedPosts(
  category: PostCategory,
  excludeSlug: string,
  locale: Locale,
): Promise<PostSummary[]> {
  const posts = await client.fetch<RawPostSummary[]>(RELATED_POSTS_QUERY, { category, excludeSlug, locale });
  return posts.map((post) => toSummary(post, locale));
}

const RECENT_POSTS_LIMIT = 5;
const RECENT_POSTS_QUERY = `*[_type == "post" && slug.current != $excludeSlug] | order(publishedAt desc)[0...${RECENT_POSTS_LIMIT}]${POST_SUMMARY_PROJECTION}`;

export async function getRecentPosts(excludeSlug: string, locale: Locale): Promise<PostSummary[]> {
  const posts = await client.fetch<RawPostSummary[]>(RECENT_POSTS_QUERY, { excludeSlug, locale });
  return posts.map((post) => toSummary(post, locale));
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
    coverImage: SanityImageRef | null;
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

const BEAUTY_KNOWLEDGE_HOME_QUERY = `*[_type == "post" && category == "beautyKnowledge"] | order(publishedAt desc)[0...5]${POST_SUMMARY_PROJECTION}`;

export async function getBeautyKnowledgeHome(locale: Locale): Promise<BeautyKnowledgeHome> {
  const posts = await client.fetch<RawPostSummary[]>(BEAUTY_KNOWLEDGE_HOME_QUERY, { locale });
  const items = posts.map((post) => toSummary(post, locale));

  const [hero, ...thumbnails] = items;
  return { hero: hero ?? null, thumbnails };
}
