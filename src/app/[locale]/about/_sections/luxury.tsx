import { getImageProps } from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { sectionHeadingClasses } from "./section-heading";

const POINT_KEYS = ["luxuryPoint1", "luxuryPoint2", "luxuryPoint3", "luxuryPoint4"] as const;

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
            {/* One step below the shared scale from lg: this is the only section heading in a
                narrow side column rather than the full page width. cn() is what makes the
                override win — two conflicting text sizes in one class list resolve by
                Tailwind's own output order otherwise, not by the order written here. */}
            <h2 className={cn(sectionHeadingClasses, "lg:text-4xl")}>{t("luxuryHeading")}</h2>
            <p className="font-serif text-xs text-[var(--color-gold)] italic sm:text-sm lg:text-base">
              {t("luxurySubtitle")}
            </p>
          </div>
          {/* w-full and text-justify override the centring this column applies to the
              heading: justified copy needs the full measure, and a bulleted list reads
              wrong centred. */}
          <div className="flex w-full flex-col gap-2 text-justify text-xs leading-relaxed text-[rgba(99,43,14,0.7)] sm:gap-3 sm:text-sm lg:text-base">
            <p>{t("luxuryLead")}</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-[var(--color-accent)]">
              {POINT_KEYS.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
