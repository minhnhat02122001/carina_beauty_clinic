import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getPathname, Link } from "@/i18n/navigation";
import { getPostBySlug, getRecentPosts, getRelatedPosts } from "@/sanity/lib/posts";
import { PostDetailView } from "@/components/blog/post-detail";
import { localizedAlternates } from "@/lib/metadata";
import { RegistrationForm } from "../../_home-sections/registration-form";

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
      url: getPathname({ locale, href }),
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
  const [t, tBlog, post, relatedPosts, recentPosts] = await Promise.all([
    getTranslations("BeautyKnowledge"),
    getTranslations("BlogPost"),
    getPostBySlug("beautyKnowledge", slug, locale),
    getRelatedPosts("beautyKnowledge", slug, locale),
    getRecentPosts(slug, locale),
  ]);

  if (!post) notFound();

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 sm:px-0">
        <Link href="/beauty-knowledge" className="mt-8 inline-block text-sm font-bold text-[var(--color-accent-bright)]">
          {t("backToList")}
        </Link>
      </div>
      <PostDetailView
        post={post}
        category="beautyKnowledge"
        relatedPosts={relatedPosts}
        recentPosts={recentPosts}
        shareLabel={tBlog("share")}
        copyLinkLabel={tBlog("copyLink")}
        linkCopiedLabel={tBlog("linkCopied")}
        relatedPostsLabel={tBlog("relatedPosts")}
        recentPostsLabel={tBlog("recentPosts")}
        scrollPrevLabel={tBlog("scrollPrev")}
        scrollNextLabel={tBlog("scrollNext")}
      />
      <RegistrationForm />
    </div>
  );
}
