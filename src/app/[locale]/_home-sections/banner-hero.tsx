import Image from "next/image";
import { useTranslations } from "next-intl";
import { Carousel } from "@/components/carousel";

const BANNERS = ["/images/hero/banner-hero.png", "/images/hero/banner-hero-1.png"] as const;

export function BannerHero() {
  const t = useTranslations("BannerHero");

  return (
    <section
      className="relative w-full overflow-hidden shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)]"
      aria-label="Carina Beauty Clinic"
    >
      <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")}>
        {BANNERS.map((src, i) => (
          <div key={src} className="relative aspect-square w-full lg:aspect-[1440/539]">
            <Image src={src} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
          </div>
        ))}
      </Carousel>
    </section>
  );
}
