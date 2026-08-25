import Image from "next/image";
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
          const images = (
            <>
              <Image
                src={banner.imageMobileUrl}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover lg:hidden"
              />
              <Image
                src={banner.imageDesktopUrl}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="hidden object-cover lg:block"
              />
            </>
          );

          return banner.url ? (
            <a key={banner.id} href={banner.url} className="relative block aspect-[750/958] w-full lg:aspect-[1440/539]">
              {images}
            </a>
          ) : (
            <div key={banner.id} className="relative aspect-[750/958] w-full lg:aspect-[1440/539]">
              {images}
            </div>
          );
        })}
      </Carousel>
    </section>
  );
}
