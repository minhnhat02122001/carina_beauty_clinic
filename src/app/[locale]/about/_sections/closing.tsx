"use client";

import SimpleMarquee from "@/components/fancy/blocks/simple-marquee";
import type { AboutImage } from "@/sanity/lib/about";
import { useTranslations } from "next-intl";
import Image from "next/image";

function MarqueeRow({ images, direction }: { images: AboutImage[]; direction: "left" | "right" }) {
  return (
    <SimpleMarquee className="w-full" direction={direction} baseVelocity={5} slowdownOnHover draggable grabCursor>
      {images.map((image) => (
        <div
          key={image.key}
          className="relative mr-3 aspect-square w-48 shrink-0 overflow-hidden rounded-xl shadow-md sm:mr-4 sm:w-60 md:w-72 lg:mr-6 lg:w-84"
        >
          <Image
            src={image.url}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 336px, (min-width: 768px) 288px, (min-width: 640px) 240px, 192px"
          />
        </div>
      ))}
    </SimpleMarquee>
  );
}

export function Closing({ images }: { images: AboutImage[] }) {
  const t = useTranslations("About");

  if (images.length === 0) return null;

  // Alternating rather than splitting down the middle, so both rows stay balanced
  // however many photos are uploaded. One photo leaves the second row empty.
  const topRow = images.filter((_, index) => index % 2 === 0);
  const bottomRow = images.filter((_, index) => index % 2 === 1);

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="flex flex-col items-center gap-5 sm:gap-6 lg:gap-8">
        {/* The rows are wider than the screen by design, so they are clipped here
            rather than letting them push the page into horizontal scroll. */}
        <div className="flex flex-col items-center gap-1 px-4 sm:gap-2 sm:px-6">
          <h2 className="text-center text-lg font-medium text-[var(--color-accent)] sm:text-xl md:text-2xl lg:text-4xl">
            {t("closingWordmark")}
          </h2>
          <p className="text-center font-serif text-xs text-[rgba(99,43,14,0.7)] italic sm:text-sm lg:text-lg">
            {t("closingTagline")}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 overflow-hidden sm:gap-4 lg:gap-6">
          <MarqueeRow images={topRow} direction="left" />
          {bottomRow.length > 0 && <MarqueeRow images={bottomRow} direction="right" />}
        </div>
      </div>
    </section>
  );
}
