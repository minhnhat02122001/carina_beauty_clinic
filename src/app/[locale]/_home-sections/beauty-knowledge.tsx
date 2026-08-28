import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BeautyKnowledgeHome } from "@/sanity/lib/posts";

export function BeautyKnowledgeHome({ hero, thumbnails }: BeautyKnowledgeHome) {
  const t = useTranslations("BeautyKnowledgeHome");

  if (!hero) return null;

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
          <Link
            href="/beauty-knowledge"
            className="flex shrink-0 items-center gap-1 text-sm font-bold text-[var(--color-accent-bright)] hover:opacity-70"
          >
            {t("viewAll")}
            <ChevronRight className="size-4 shrink-0" />
          </Link>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <Link
            href={{ pathname: "/beauty-knowledge/[slug]", params: { slug: hero.slug } }}
            className="group flex flex-col gap-4 lg:w-[700px] lg:shrink-0"
          >
            <div className="relative aspect-[343/193] w-full overflow-hidden rounded-2xl shadow-xl lg:aspect-[700/344]">
              {hero.imageUrl && (
                <Image
                  src={hero.imageUrl}
                  alt=""
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(min-width: 1024px) 700px, 100vw"
                />
              )}
            </div>
            <p className="text-sm font-bold text-[rgba(80,38,14,0.7)] transition-colors group-hover:text-[var(--color-accent-bright)] lg:text-base">
              {hero.title}
            </p>
          </Link>

          <div className="flex flex-1 flex-col gap-3">
            {thumbnails.map((item) => (
              <Link
                key={item.id}
                href={{ pathname: "/beauty-knowledge/[slug]", params: { slug: item.slug } }}
                className="group flex items-start gap-2"
              >
                <div className="relative aspect-[132/74] w-[132px] shrink-0 overflow-hidden rounded-xl lg:w-[200px]">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="200px"
                    />
                  )}
                </div>
                <p className="line-clamp-4 flex-1 text-xs font-bold text-[rgba(80,38,14,0.7)] transition-colors group-hover:text-[var(--color-accent-bright)] lg:line-clamp-5 lg:text-sm">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
