import { useTranslations } from "next-intl";
import { IntroClip } from "./intro-clip";

export function Intro({ videoId, thumbnailUrl }: { videoId: string; thumbnailUrl: string | null }) {
  const t = useTranslations("About");
  const hasClip = Boolean(videoId);

  return (
    <section className="bg-[var(--color-background-alt)] px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex flex-1 flex-col gap-3 sm:gap-4">
          <p className="font-serif text-[10px] tracking-[2.4px] text-[var(--color-accent)] uppercase sm:text-xs">
            {t("introEyebrow")}
          </p>
          <h1 className="text-xl font-medium text-[var(--color-accent)] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
            {t("introHeading")}
          </h1>
          <p className="text-xs leading-relaxed text-[rgba(99,43,14,0.7)] sm:text-sm lg:text-base">
            {t("introParagraph1")}
          </p>
          <p className="text-xs leading-relaxed text-[rgba(99,43,14,0.7)] sm:text-sm lg:text-base">
            {t("introParagraph2")}
          </p>
        </div>

        {hasClip && (
          <div className="w-full lg:w-2/5">
            <IntroClip videoId={videoId} thumbnailUrl={thumbnailUrl} playLabel={t("clipPlayLabel")} />
          </div>
        )}
      </div>
    </section>
  );
}
