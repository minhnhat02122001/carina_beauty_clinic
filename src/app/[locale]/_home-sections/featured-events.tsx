"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Carousel } from "@/components/carousel";
import type { FeaturedNewsItem } from "@/sanity/lib/posts";
import type { VideoItem } from "@/sanity/lib/videos";

function VideoModal({
  videoId,
  title,
  closeLabel,
  watchOnYoutubeLabel,
  onClose,
}: {
  videoId: string;
  title: string;
  closeLabel: string;
  watchOnYoutubeLabel: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    // `overflow: hidden` alone doesn't block touch-driven scroll on iOS
    // Safari — pinning the body via `position: fixed` does.
    const scrollY = window.scrollY;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);

  const embedId = videoId.split("?")[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="relative flex w-auto max-w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute -top-10 right-0 flex size-8 items-center justify-center text-white hover:opacity-80"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-6">
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div
          className="relative overflow-hidden rounded-xl bg-black"
          style={{
            height: "min(70dvh, 700px)",
            width: "min(90vw, calc(min(70dvh, 700px) * 9 / 16))",
          }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${embedId}?autoplay=1&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${embedId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-sm font-bold text-white underline hover:opacity-80"
        >
          {watchOnYoutubeLabel}
        </a>
      </div>
    </div>
  );
}

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
                href="/news-events"
                className="flex shrink-0 items-center gap-1 text-sm font-bold text-[var(--color-link)]"
              >
                {t("viewAll")}
                <span className="relative size-4">
                  <Image
                    src="/images/featured-events/icon-arrow.svg"
                    alt=""
                    fill
                    className="object-contain"
                    sizes="16px"
                  />
                </span>
              </Link>
            </div>

            <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")} itemsPerView={{ base: 2, lg: 5 }}>
              {videos.map((video) => (
                <div key={video.id} className="flex flex-col items-center">
                  {video.videoId ? (
                    <button
                      type="button"
                      onClick={() => setActiveVideo({ videoId: video.videoId, title: video.caption })}
                      className="relative block aspect-[289/511] w-full overflow-hidden rounded-xl bg-[var(--color-background-alt)]"
                    >
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
                className="flex shrink-0 items-center gap-1 text-sm font-bold text-[var(--color-link)]"
              >
                {t("viewAll")}
                <span className="relative size-4">
                  <Image
                    src="/images/featured-events/icon-arrow.svg"
                    alt=""
                    fill
                    className="object-contain"
                    sizes="16px"
                  />
                </span>
              </Link>
            </div>

            <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")} itemsPerView={{ base: 1, lg: 3 }}>
              {news.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <div className="relative aspect-[280/160] w-full overflow-hidden rounded-xl bg-[var(--color-background-alt)]">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 380px, 260px"
                      />
                    )}
                  </div>
                  <p className="pt-4 text-sm font-bold text-[rgba(80,38,14,0.7)] lg:text-base">{item.title}</p>
                  <p className="pt-2 text-sm text-[rgba(80,38,14,0.7)]">{item.date}</p>
                </div>
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
          watchOnYoutubeLabel={t("watchOnYoutube")}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  );
}
