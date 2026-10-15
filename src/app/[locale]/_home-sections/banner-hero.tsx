import { getImageProps } from "next/image";
import { useTranslations } from "next-intl";
import { Carousel } from "@/components/carousel";
import type { BannerItem } from "@/sanity/lib/banners";

export function BannerHero({ banners }: { banners: BannerItem[] }) {
  const t = useTranslations("BannerHero");

  if (banners.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)]"
      aria-label="Carina Beauty Clinic"
    >
      <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")}>
        {banners.map((banner, i) => {
          // One <picture> instead of two <Image>s: the browser fetches only the source matching the viewport,
          // whereas two preloaded images made phones download the desktop banner too.
          const common = {
            alt: banner.alt,
            fill: true,
            sizes: "100vw",
            loading: i === 0 ? ("eager" as const) : ("lazy" as const),
            fetchPriority: i === 0 ? ("high" as const) : undefined,
          };
          const {
            props: { srcSet: desktopSrcSet },
          } = getImageProps({ ...common, src: banner.imageDesktopUrl });
          const {
            props: { srcSet: mobileSrcSet, ...imgProps },
          } = getImageProps({ ...common, src: banner.imageMobileUrl });
          const images = (
            <picture>
              <source media="(min-width: 64rem)" srcSet={desktopSrcSet} sizes="100vw" />
              <img {...imgProps} alt={banner.alt} srcSet={mobileSrcSet} className="object-cover lg:object-contain" />
            </picture>
          );
          const boxClassName = "relative block aspect-[750/958] w-full lg:aspect-[2400/960]";

          return banner.url ? (
            <a key={banner.id} href={banner.url} className={boxClassName}>
              {images}
            </a>
          ) : (
            <div key={banner.id} className={boxClassName}>
              {images}
            </div>
          );
        })}
      </Carousel>
    </section>
  );
}
