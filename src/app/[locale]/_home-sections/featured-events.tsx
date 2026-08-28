"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Carousel } from "@/components/carousel";
import { VideoModal } from "@/components/video-modal";
import type { FeaturedNewsItem } from "@/sanity/lib/posts";
import type { VideoItem } from "@/sanity/lib/videos";

export function FeaturedEvents({ news, videos }: { news: FeaturedNewsItem[]; videos: VideoItem[] }) {
  const t = useTranslations("FeaturedEvents");
  const [activeVideo, setActiveVideo] = useState<{ videoId: string; title: string } | null>(null);

  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col gap-8 lg:gap-12">
        {videos.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="relative size-6 shrink-0 lg:size-7">
                  <Image
                    src="/images/featured-events/icon-video.svg"
                    alt=""
                    fill
                    className="object-contain"
                    sizes="28px"
                  />
                  <span className="absolute top-[56%] left-1/2 size-[26%] -translate-x-1/2 -translate-y-1/2 rotate-90">
                    <Image
                      src="/images/featured-events/icon-video-polygon.svg"
                      alt=""
                      fill
                      className="object-contain"
                      sizes="8px"
                    />
                  </span>
                </span>
                <h2 className="text-base font-semibold text-[var(--color-accent)] lg:text-lg">{t("videosHeading")}</h2>
              </div>
              <Link
                href="/videos"
                className="flex shrink-0 items-center gap-1 text-sm font-bold text-[var(--color-accent-bright)] hover:opacity-70"
              >
                {t("viewAll")}
                <ChevronRight className="size-4 shrink-0" />
              </Link>
            </div>

            <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")} itemsPerView={{ base: 2, lg: 5 }}>
              {videos.map((video) => (
                <div key={video.id} className="flex flex-col items-center">
                  {video.videoId ? (
                    <button
                      type="button"
                      onClick={() => setActiveVideo({ videoId: video.videoId, title: video.caption })}
                      className="group relative block aspect-[289/511] w-full overflow-hidden rounded-xl bg-[var(--color-background-alt)]"
                    >
                      {video.thumbnailUrl && (
                        <Image
                          src={video.thumbnailUrl}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(min-width: 1024px) 220px, 200px"
                        />
                      )}
                      <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                      <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(2,11,39,0.4)] transition-transform duration-300 group-hover:scale-110 lg:size-14">
                        <span className="relative size-5 lg:size-[30px]">
                          <Image
                            src="/images/featured-events/icon-play.svg"
                            alt=""
                            fill
                            className="object-contain"
                            sizes="30px"
                          />
                        </span>
                      </span>
                    </button>
                  ) : (
                    <div className="relative aspect-[289/511] w-full overflow-hidden rounded-xl bg-[var(--color-background-alt)]">
                      {video.thumbnailUrl && (
                        <Image
                          src={video.thumbnailUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 220px, 200px"
                        />
                      )}
                      <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(2,11,39,0.4)] lg:size-14">
                        <span className="relative size-5 lg:size-[30px]">
                          <Image
                            src="/images/featured-events/icon-play.svg"
                            alt=""
                            fill
                            className="object-contain"
                            sizes="30px"
                          />
                        </span>
                      </span>
                    </div>
                  )}
                  <p className="w-full px-1 pt-3 text-sm text-[var(--color-accent)]">{video.caption}</p>
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {news.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="relative size-6 shrink-0 lg:size-7">
                  <Image
                    src="/images/featured-events/icon-camera.svg"
                    alt=""
                    fill
                    className="object-contain"
                    sizes="28px"
                  />
                </span>
                <h2 className="text-base font-semibold text-[var(--color-accent)] lg:text-lg">{t("newsHeading")}</h2>
              </div>
              <Link
                href="/news-events"
                className="flex shrink-0 items-center gap-1 text-sm font-bold text-[var(--color-accent-bright)] hover:opacity-70"
              >
                {t("viewAll")}
                <ChevronRight className="size-4 shrink-0" />
              </Link>
            </div>

            <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")} itemsPerView={{ base: 1, lg: 3 }}>
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={{ pathname: "/news-events/[slug]", params: { slug: item.slug } }}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[280/160] w-full overflow-hidden rounded-xl bg-[var(--color-background-alt)]">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(min-width: 1024px) 380px, 260px"
                      />
                    )}
                  </div>
                  <p className="pt-4 text-sm font-bold text-[rgba(80,38,14,0.7)] lg:text-base">{item.title}</p>
                  <p className="pt-2 text-sm text-[rgba(80,38,14,0.7)]">{item.date}</p>
                </Link>
              ))}
            </Carousel>
          </div>
        )}
      </div>
      {activeVideo && (
        <VideoModal
          videoId={activeVideo.videoId}
          title={activeVideo.title}
          closeLabel={t("closeVideo")}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  );
}
