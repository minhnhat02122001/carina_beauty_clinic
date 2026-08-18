import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getPostsByCategory } from "@/sanity/lib/posts";
import { PostList } from "@/components/blog/post-list";
import { localizedAlternates } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "NewsEvents" });

  return {
    title: t("heading"),
    description: t("description"),
    alternates: localizedAlternates(locale, "/news-events"),
  };
}

export default async function NewsEventsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [t, posts] = await Promise.all([getTranslations("NewsEvents"), getPostsByCategory("newsEvents", locale)]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10 lg:py-16">
      <h1 className="text-2xl font-semibold text-[var(--color-accent)] lg:text-4xl">{t("heading")}</h1>
      <div className="mt-8">
        <PostList
          posts={posts}
          emptyLabel={t("empty")}
          getHref={(slug) => ({ pathname: "/news-events/[slug]", params: { slug } })}
        />
      </div>
    </div>
  );
}
