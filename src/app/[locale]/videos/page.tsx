import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getAllVideos } from "@/sanity/lib/videos";
import { VideoGrid } from "@/components/videos/video-grid";
import { localizedAlternates } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Videos" });

  return {
    title: t("heading"),
    description: t("description"),
    alternates: localizedAlternates(locale, "/videos"),
  };
}

export default async function VideosPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [t, videos] = await Promise.all([getTranslations("Videos"), getAllVideos(locale)]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10 lg:py-16">
      <h1 className="text-2xl font-semibold text-[var(--color-accent)] lg:text-4xl">{t("heading")}</h1>
      <div className="mt-8">
        <VideoGrid videos={videos} emptyLabel={t("empty")} closeVideoLabel={t("closeVideo")} />
      </div>
    </div>
  );
}
