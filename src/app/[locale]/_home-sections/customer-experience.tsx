"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Carousel } from "@/components/carousel";

const CHIP_KEYS = [
  "chipExclusive",
  "chipLiftingRejuvenation",
  "chipMelasma",
  "chipScar",
  "chipAcne",
  "chipBodyCare",
  "chipSkinCare",
  "chipRejuvenationInjections",
] as const;

const CARDS = [
  { key: "cardUltherPrimeX", image: "/images/services/highlight-ulther-prime-x.png", categories: ["chipExclusive", "chipLiftingRejuvenation"] },
  { key: "cardUltherPrimeX", image: "/images/services/highlight-ulther-prime-x.png", categories: ["chipExclusive", "chipLiftingRejuvenation"] },
  { key: "cardSolarRise", image: "/images/services/highlight-solar-rise.png", categories: ["chipExclusive", "chipLiftingRejuvenation"] },
  { key: "cardSolarRise", image: "/images/services/highlight-solar-rise.png", categories: ["chipExclusive", "chipLiftingRejuvenation"] },
  { key: "cardLunaShine", image: "/images/services/highlight-luna-shine.png", categories: ["chipExclusive", "chipSkinCare"] },
  { key: "cardUltherPrimeX", image: "/images/services/highlight-ulther-prime-x.png", categories: ["chipExclusive", "chipLiftingRejuvenation"] },
  { key: "cardLunaShine", image: "/images/services/highlight-luna-shine.png", categories: ["chipExclusive", "chipSkinCare"] },
] as const;

const activeChipClasses = "border-[#ffe15a] bg-white text-[#f3c213]";
const inactiveChipClasses = "border-[#a9b2be] bg-white text-[#4a4f63]";

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-9 shrink-0 items-center gap-4 overflow-hidden whitespace-nowrap rounded-full border pl-4 text-sm font-bold ${
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

export function CustomerExperience() {
  const t = useTranslations("CustomerExperience");
  const [activeFilter, setActiveFilter] = useState<string>(CHIP_KEYS[0]);

  const visibleCards = CARDS.filter((card) => (card.categories as readonly string[]).includes(activeFilter));

  return (
    <section className="flex flex-col items-center px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div
        className="mx-auto flex w-full max-w-[1216px] flex-col items-center gap-4 rounded-xl px-4 py-4 sm:px-6 lg:gap-6 lg:px-4 lg:py-6"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(239, 194, 91, 0.89) 10%, rgb(221, 176, 75) 19%, rgb(222, 175, 69) 32%, rgb(255, 227, 164) 75%)",
        }}
      >
        <h2 className="text-center text-2xl text-[var(--color-accent)] lg:text-5xl">{t("heading")}</h2>

        <div className="flex w-full items-start gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            {visibleCards.map((card, index) => (
              <div key={`${card.key}-${index}`} className="flex flex-col items-center gap-2">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                  <Image src={card.image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 384px, calc(100vw - 64px)" />
                </div>
                <p className="text-center font-sans text-sm font-bold text-[var(--color-accent)] lg:text-lg">
                  {t(card.key)}
                </p>
              </div>
            ))}
          </Carousel>
        ) : (
          <p className="w-full py-8 text-center text-sm font-bold text-[var(--color-accent)]">{t("emptyCategory")}</p>
        )}
      </div>

      <Link
        href="/booking"
        className="mt-4 rounded-full bg-[var(--color-accent)] px-6 py-2 text-center text-sm font-bold tracking-[0.14px] text-[#fcfcfc] hover:opacity-90 lg:mt-6 lg:text-base"
      >
        {t("cta")}
      </Link>
    </section>
  );
}
