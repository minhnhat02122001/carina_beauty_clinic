import Image from "next/image";
import { useTranslations } from "next-intl";
import { Carousel } from "@/components/carousel";
import type { AboutPressMention } from "@/sanity/lib/about";

export function Press({ mentions }: { mentions: AboutPressMention[] }) {
  const t = useTranslations("About");

  if (mentions.length === 0) return null;

  return (
    <section className="bg-[var(--color-background-alt)] px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-6 lg:gap-8">
        <h2 className="text-center text-lg font-medium text-[var(--color-accent)] sm:text-xl md:text-2xl lg:text-4xl">
          {t("pressHeading")}
        </h2>

        {/* No lightboxImages here — the cards are already links, and the Carousel
            would wrap each one in a button. */}
        <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")} itemsPerView={{ base: 1, lg: 3 }} hoverShadow>
          {mentions.map((mention) => (
            <a
              key={mention.key}
              href={mention.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-3 overflow-hidden rounded-xl bg-[var(--background)] pb-4 transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={mention.screenshotUrl}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 384px, 100vw"
                />
              </div>
              <div className="flex flex-col gap-1 px-4">
                {mention.outletName && (
                  <p className="text-xs font-semibold tracking-[1.2px] text-[var(--color-gold)] uppercase">
                    {mention.outletName}
                  </p>
                )}
                <p className="line-clamp-2 text-sm font-medium text-[var(--color-accent)] lg:text-base">
                  {mention.title}
                </p>
                <p className="text-xs text-[var(--color-muted)] underline-offset-2 group-hover:underline">
                  {t("pressLinkLabel")}
                </p>
              </div>
            </a>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
