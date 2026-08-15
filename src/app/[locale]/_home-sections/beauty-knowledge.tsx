import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const THUMBNAILS = [
  "/images/beauty-knowledge/thumb-1.png",
  "/images/beauty-knowledge/thumb-2.png",
  "/images/beauty-knowledge/thumb-3.png",
  "/images/beauty-knowledge/thumb-4.png",
] as const;

export function BeautyKnowledgeHome() {
  const t = useTranslations("BeautyKnowledgeHome");

  return (
    <section
      className="px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(252, 234, 192) 16.346%, rgb(252, 235, 195) 47.115%, rgb(255, 238, 199) 61.058%, rgb(255, 241, 210) 81.25%, rgb(255, 255, 255) 97.596%)",
      }}
    >
      <div className="mx-auto flex max-w-[1216px] flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="relative size-6 shrink-0 lg:size-7">
              <Image src="/images/beauty-knowledge/icon-book.svg" alt="" fill className="object-contain" sizes="28px" />
            </span>
            <h2 className="text-base font-semibold text-[var(--color-accent)] lg:text-lg">{t("heading")}</h2>
          </div>
          <Link href="/beauty-knowledge" className="flex shrink-0 items-center gap-1 text-sm font-bold text-[var(--color-link)]">
            {t("viewAll")}
            <span className="relative size-4">
              <Image src="/images/featured-events/icon-arrow.svg" alt="" fill className="object-contain" sizes="16px" />
            </span>
          </Link>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-4 lg:w-[700px] lg:shrink-0">
            <div className="relative aspect-[343/193] w-full overflow-hidden rounded-2xl shadow-xl lg:aspect-[700/344]">
              <Image src="/images/beauty-knowledge/hero.png" alt="" fill className="object-cover" sizes="(min-width: 1024px) 700px, 100vw" />
            </div>
            <p className="text-sm font-bold text-[rgba(80,38,14,0.7)] lg:text-base">{t("articleTitle")}</p>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            {THUMBNAILS.map((src) => (
              <div key={src} className="flex items-start gap-2">
                <div className="relative aspect-[132/74] w-[132px] shrink-0 overflow-hidden rounded-xl lg:w-[200px]">
                  <Image src={src} alt="" fill className="object-cover" sizes="200px" />
                </div>
                <p className="flex-1 text-xs font-bold text-[var(--color-accent)] lg:text-sm">{t("articleTitle")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
