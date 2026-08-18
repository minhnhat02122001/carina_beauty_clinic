import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getPostBySlug } from "@/sanity/lib/posts";
import { PostDetailView } from "@/components/blog/post-detail";
import { localizedAlternates } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug("beautyKnowledge", slug, locale);

  if (!post) return {};

  const href = { pathname: "/beauty-knowledge/[slug]", params: { slug } } as const;

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: localizedAlternates(locale, href),
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAtISO,
      images: post.imageUrl ? [{ url: post.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  };
}

export default async function BeautyKnowledgeDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [t, post] = await Promise.all([
    getTranslations("BeautyKnowledge"),
    getPostBySlug("beautyKnowledge", slug, locale),
  ]);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <Link href="/beauty-knowledge" className="mt-8 inline-block text-sm font-bold text-[var(--color-link)]">
        {t("backToList")}
      </Link>
      <PostDetailView post={post} />
    </div>
  );
}
