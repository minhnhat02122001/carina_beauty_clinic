import type { PostCategory } from "@/sanity/lib/posts";

export const CATEGORY_ROUTES = {
  beautyKnowledge: "/beauty-knowledge/[slug]",
  newsEvents: "/news-events/[slug]",
  promotions: "/promotions/[slug]",
} as const satisfies Record<PostCategory, string>;
