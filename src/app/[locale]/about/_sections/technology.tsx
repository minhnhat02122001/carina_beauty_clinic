import { Carousel } from "@/components/carousel";
import type { AboutImage } from "@/sanity/lib/about";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BannerImage } from "./banner-image";

// Placeholders until the client supplies the real composite banner — dropping the
// final files at these same paths is the whole swap.
const BANNER_SRC = "/images/about/technology-banner-desktop.jpg";
const BANNER_MOBILE_SRC = "/images/about/technology-banner-mobile.png";

export function Technology({ images }: { images: AboutImage[] }) {
  const t = useTranslations("About");

  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-5 sm:gap-6 lg:gap-8">
        {/* The heading and its quote read as one unit, so they sit closer together
            than the section's outer gap spaces the banner and carousel. */}
        <div className="flex flex-col items-center gap-2 lg:gap-3">
          <h2 className="text-center text-lg font-medium text-[var(--color-accent)] sm:text-xl md:text-2xl lg:text-4xl">
            {t("techHeading")}
          </h2>

          <div className="flex flex-col items-center gap-1">
            <p className="text-center font-serif text-xs text-[rgba(99,43,14,0.7)] italic sm:text-sm lg:text-lg">
              {t("techQuoteLine1")}
            </p>
            <p className="text-center font-serif text-xs text-[rgba(99,43,14,0.7)] italic sm:text-sm lg:text-lg">
              {t("techQuoteLine2")}
            </p>
          </div>
        </div>

        <BannerImage desktopSrc={BANNER_SRC} mobileSrc={BANNER_MOBILE_SRC} alt={t("techBannerAlt")} />

        <p className="text-center font-serif text-xs text-[rgba(99,43,14,0.7)] italic sm:text-sm lg:text-lg">
          {t("techClosing")}
        </p>

        {images.length > 0 && (
          <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")} itemsPerView={{ base: 2, lg: 4 }}>
            {images.map((image) => (
              <div key={image.key} className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                <Image src={image.url} alt="" fill className="object-cover" sizes="(min-width: 1024px) 280px, 45vw" />
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
}
