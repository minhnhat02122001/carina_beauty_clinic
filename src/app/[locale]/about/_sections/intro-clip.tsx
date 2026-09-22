"use client";

import Image from "next/image";
import { useState } from "react";

export function IntroClip({
  videoId,
  thumbnailUrl,
  playLabel,
}: {
  videoId: string;
  thumbnailUrl: string | null;
  playLabel: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative mx-auto aspect-[9/16] w-2/3 max-w-[280px] overflow-hidden rounded-2xl bg-[var(--color-background-alt)] sm:max-w-[320px] lg:w-full lg:max-w-[420px]">
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
          title={playLabel}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        // The poster stands in until play is pressed, so an idle visit never pays
        // for YouTube's player on mobile.
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={playLabel}
          className="group relative size-full"
        >
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt=""
              fill
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 320px, 66vw"
            />
          )}
          <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
          <span className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(2,11,39,0.4)] transition-transform duration-300 group-hover:scale-110 lg:size-16">
            <span className="relative size-6 lg:size-8">
              <Image src="/images/featured-events/icon-play.svg" alt="" fill className="object-contain" sizes="32px" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
