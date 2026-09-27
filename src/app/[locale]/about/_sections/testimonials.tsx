import Image from "next/image";
import { useTranslations } from "next-intl";
import { Carousel } from "@/components/carousel";
import type { AboutImage } from "@/sanity/lib/about";

export function Testimonials({ images }: { images: AboutImage[] }) {
  const t = useTranslations("About");

  if (images.length === 0) return null;

  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-6 lg:gap-8">
        <h2 className="text-center text-lg font-medium text-[var(--color-accent)] sm:text-xl md:text-2xl lg:text-4xl">
          {t("testimonialsHeading")}
        </h2>

        <Carousel
          prevLabel={t("scrollPrev")}
          nextLabel={t("scrollNext")}
          itemsPerView={{ base: 1, lg: 3 }}
          lightboxImages={images.map((image) => image.url)}
          lightboxCloseLabel={t("lightboxClose")}
        >
          {images.map((image) => (
            <div key={image.key} className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-white">
              {/* object-contain: review screenshots arrive in every shape, and cropping
                  one cuts off the words that make it worth showing. */}
              <Image src={image.url} alt="" fill className="object-contain" sizes="(min-width: 1024px) 384px, 100vw" />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
