"use client";

import Image from "next/image";
import { useState } from "react";
import { VideoModal } from "@/components/video-modal";
import type { VideoItem } from "@/sanity/lib/videos";

export function VideoGrid({
  videos,
  emptyLabel,
  closeVideoLabel,
}: {
  videos: VideoItem[];
  emptyLabel: string;
  closeVideoLabel: string;
}) {
  const [activeVideo, setActiveVideo] = useState<{ videoId: string; title: string } | null>(null);

  if (videos.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--color-muted)]">{emptyLabel}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
                  />
                )}
                <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(2,11,39,0.4)] transition-transform duration-300 group-hover:scale-110 lg:size-14">
                  <span className="relative size-5 lg:size-[30px]">
                    <Image src="/images/featured-events/icon-play.svg" alt="" fill className="object-contain" sizes="30px" />
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
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
                  />
                )}
                <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(2,11,39,0.4)] lg:size-14">
                  <span className="relative size-5 lg:size-[30px]">
                    <Image src="/images/featured-events/icon-play.svg" alt="" fill className="object-contain" sizes="30px" />
                  </span>
                </span>
              </div>
            )}
            <p className="w-full px-1 pt-3 text-sm text-[var(--color-accent)]">{video.caption}</p>
          </div>
        ))}
      </div>

      {activeVideo && (
        <VideoModal
          videoId={activeVideo.videoId}
          title={activeVideo.title}
          closeLabel={closeVideoLabel}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </>
  );
}
