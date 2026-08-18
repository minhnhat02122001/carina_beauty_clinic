"use client";

import { Carousel } from "@/components/carousel";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import type { ServiceHighlightItem } from "@/sanity/lib/serviceHighlights";

const CHIP_KEYS = [
  "chipExclusive",
  "chipLiftingRejuvenation",
  "chipSkinTreatment",
  "chipRejuvenationInjections",
  "chipBodyCare",
  "chipSkinCare",
] as const;

const activeChipClasses = "border-[#ffe15a] bg-white text-[#f3c213]";
const inactiveChipClasses = "border-[#a9b2be] bg-white text-[#4a4f63]";

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-9 shrink-0 items-center gap-4 overflow-hidden rounded-full border pl-4 text-sm font-bold whitespace-nowrap ${
        active ? activeChipClasses : inactiveChipClasses
      }`}
    >
      <span>{label}</span>
      <span className="relative h-full w-0 shrink-0">
        {active && (
          <>
            <span className="absolute top-px right-px size-[26px]">
              <Image src="/images/services/chip-check-bg.svg" alt="" fill sizes="26px" />
            </span>
            <span className="absolute top-[6px] right-[6px] size-2">
              <Image src="/images/services/chip-check-icon.svg" alt="" fill className="object-contain" sizes="8px" />
            </span>
          </>
        )}
      </span>
    </button>
  );
}

export function CustomerExperience({ cards }: { cards: ServiceHighlightItem[] }) {
  const t = useTranslations("CustomerExperience");
  const [activeFilter, setActiveFilter] = useState<string>(CHIP_KEYS[0]);

  const visibleCards = cards.filter((card) => card.categories.includes(activeFilter));

  return (
    <section
      className="flex flex-col items-center px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgb(250, 249, 246) 0%, rgb(252, 234, 192) 16.346%, rgb(252, 235, 195) 47.115%, rgb(255, 238, 199) 61.058%, rgb(255, 241, 210) 81.25%, rgb(255, 255, 255) 97.596%)",
      }}
    >
      <div
        className="mx-auto flex w-full max-w-[1216px] flex-col items-center gap-4 rounded-xl px-4 py-4 sm:px-6 lg:gap-6 lg:px-4 lg:py-6"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(239, 194, 91, 0.89) 10%, rgb(221, 176, 75) 19%, rgb(222, 175, 69) 32%, rgb(255, 227, 164) 75%)",
        }}
      >
        <h2 className="text-center text-2xl text-[var(--color-accent)] lg:text-5xl">{t("heading")}</h2>

        <div className="flex w-full [scrollbar-width:none] items-start gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {CHIP_KEYS.map((key) => (
            <Chip key={key} label={t(key)} active={activeFilter === key} onClick={() => setActiveFilter(key)} />
          ))}
        </div>

        {visibleCards.length > 0 ? (
          <Carousel
            key={activeFilter}
            prevLabel={t("scrollPrev")}
            nextLabel={t("scrollNext")}
            edgeOffset="flush"
            itemsPerView={{ base: 1, lg: 3 }}
          >
            {visibleCards.map((card) => (
              <div key={card.id} className="flex flex-col items-center gap-2">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                  <Image
                    src={card.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 384px, calc(100vw - 64px)"
                  />
                </div>
                <p className="text-center font-sans text-sm font-bold text-[var(--color-accent)] lg:text-lg">
                  {card.name}
                </p>
              </div>
            ))}
          </Carousel>
        ) : (
          <p className="w-full py-8 text-center text-sm font-bold text-[var(--color-accent)]">{t("emptyCategory")}</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 px-2 lg:mt-6">
        <Link
          href="/about"
          className="rounded-full border border-[var(--color-accent)] bg-white px-3 py-2 text-center text-xs font-bold tracking-[0.16px] whitespace-nowrap text-[#50260e] hover:opacity-80 sm:px-4 sm:text-sm lg:text-base"
        >
          {t("ctaMore")}
        </Link>
        <Link
          href={{ pathname: "/", hash: "registration-form" }}
          className="rounded-full bg-[var(--color-accent)] px-3 py-2 text-center text-xs font-bold tracking-[0.16px] whitespace-nowrap text-[#fcfcfc] hover:opacity-90 sm:px-4 sm:text-sm lg:text-base"
        >
          {t("ctaBooking")}
        </Link>
      </div>
    </section>
  );
}
