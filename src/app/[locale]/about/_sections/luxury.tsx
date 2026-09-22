import Image from "next/image";
import { useTranslations } from "next-intl";

const PARAGRAPH_KEYS = [
  "luxuryParagraph1",
  "luxuryParagraph2",
  "luxuryParagraph3",
  "luxuryParagraph4",
  "luxuryParagraph5",
] as const;

export function Luxury({ facadeImageUrl }: { facadeImageUrl: string | null }) {
  const t = useTranslations("About");

  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:gap-12">
        {facadeImageUrl && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-[3/2] lg:aspect-[3/4] lg:w-2/5">
            <Image
              src={facadeImageUrl}
              alt={t("facadeAlt")}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 480px, 100vw"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col items-center gap-3 text-center sm:gap-4">
          <h2 className="text-base font-semibold text-[var(--color-accent)] sm:text-lg md:text-xl lg:text-3xl">
            {t("luxuryHeading")}
          </h2>
          <p className="font-serif text-xs text-[var(--color-gold)] italic sm:text-sm lg:text-lg">
            {t("luxurySubtitle")}
          </p>
          {PARAGRAPH_KEYS.map((key) => (
            <p key={key} className="text-xs leading-relaxed text-[rgba(99,43,14,0.7)] sm:text-sm lg:text-base">
              {t(key)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
