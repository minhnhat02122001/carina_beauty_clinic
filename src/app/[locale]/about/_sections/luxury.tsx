import { Merriweather } from "next/font/google";
import { getImageProps } from "next/image";
import { useTranslations } from "next-intl";
import BreathingText from "@/components/fancy/text/breathing-text";

const PARAGRAPH_KEYS = [
  "luxuryParagraph1",
  "luxuryParagraph2",
  "luxuryParagraph3",
  "luxuryParagraph4",
  "luxuryParagraph5",
] as const;

// BreathingText animates the wght axis, which only exists on the variable cut of
// the heading font — the root layout loads Merriweather as static 400/700, where
// font-variation-settings does nothing. Declared here so the extra file is
// fetched on this page alone and every other heading on the site keeps rendering
// exactly as before.
const merriweatherVariable = Merriweather({ subsets: ["latin", "vietnamese"] });

// Two sizes of the same square photo, swapped by <picture> like the homepage
// hero. These are the hero's own files: the facade shot is the same building at
// the same square crop, so there is nothing separate to upload.
const {
  props: { srcSet: facadeDesktopSrcSet },
} = getImageProps({ src: "/images/hero/building-desktop.png", alt: "", width: 1752, height: 1752, quality: 90 });
const {
  props: { srcSet: facadeMobileSrcSet, ...facadeMobileImgProps },
} = getImageProps({ src: "/images/hero/building-mobile.png", alt: "", width: 1290, height: 1290, quality: 90 });

export function Luxury() {
  const t = useTranslations("About");

  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      {/* The facade photo is first in the DOM so it sits on the left from lg. Mobile
          reverses the column so the heading is read before its photo. */}
      <div className="mx-auto flex max-w-[1216px] flex-col-reverse gap-6 sm:gap-8 lg:flex-row lg:items-center lg:gap-12">
        {/* One ratio at every breakpoint: the frame used to flip from landscape to
            portrait, so a single upload could not survive both centre crops. */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl lg:w-2/5">
          <picture>
            <source media="(min-width: 1024px)" srcSet={facadeDesktopSrcSet} sizes="480px" />
            <img
              {...facadeMobileImgProps}
              srcSet={facadeMobileSrcSet}
              sizes="100vw"
              alt={t("facadeAlt")}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        </div>

        <div className="flex flex-1 flex-col items-center gap-3 text-center sm:gap-4">
          {/* Heading and its subtitle are one unit, closer than the paragraph rhythm. */}
          <div className="flex flex-col items-center gap-1">
            {/* Kept on one line from lg, where the text column is only ~432px at 1024px
                and ~682px at 1440px. Merriweather uppercase runs ~0.61em per glyph, so
                these 38 characters need ~23em — 30px would overflow at every PC width.
                The breath tops out at 600, the weight this heading already had, so the
                animation never makes the line wider than that fit allows. */}
            <BreathingText
              as="h2"
              className={`${merriweatherVariable.className} text-base font-semibold text-[var(--color-accent)] sm:text-lg md:text-xl lg:text-lg lg:whitespace-nowrap xl:text-2xl`}
              fromFontVariationSettings="'wght' 800"
              toFontVariationSettings="'wght' 300"
              transition={{ duration: 2, ease: "backInOut" }}
              staggerDuration={0.03}
              staggerFrom="first"
            >
              {t("luxuryHeading")}
            </BreathingText>
            <p className="font-serif text-xs text-[var(--color-gold)] italic sm:text-sm lg:text-base">
              {t("luxurySubtitle")}
            </p>
          </div>
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
