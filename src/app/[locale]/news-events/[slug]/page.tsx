import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getPathname, Link } from "@/i18n/navigation";
import { getPostBySlug, getRecentPosts, getRelatedPosts } from "@/sanity/lib/posts";
import { PostDetailView } from "@/components/blog/post-detail";
import { seoMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/json-ld";
import { articleJsonLd } from "@/lib/structured-data";
import { RegistrationForm } from "@/components/registration-form/registration-form";

export const generateStaticParams = () => [];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug("newsEvents", slug, locale);

  if (!post) return {};

  return seoMetadata(
    post.seo,
    {
      title: post.title,
      description: post.excerpt || undefined,
      imageUrl: post.imageUrl,
      publishedTime: post.publishedAtISO,
    },
    locale,
    { pathname: "/news-events/[slug]", params: { slug } },
  );
}

export default async function NewsEventsDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const [t, tBlog, post, relatedPosts, recentPosts] = await Promise.all([
    getTranslations("NewsEvents"),
    getTranslations("BlogPost"),
    getPostBySlug("newsEvents", slug, locale),
    getRelatedPosts("newsEvents", slug, locale),
    getRecentPosts(slug, locale),
  ]);

  if (!post) notFound();

  return (
    <div>
      <JsonLd
        data={articleJsonLd(
          post,
          getPathname({ locale, href: { pathname: "/news-events/[slug]", params: { slug } } }),
          locale,
        )}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-0">
        <Link href="/news-events" className="mt-8 inline-block text-sm font-bold text-[var(--color-accent-bright)]">
          {t("backToList")}
        </Link>
      </div>
      <PostDetailView
        post={post}
        category="newsEvents"
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
