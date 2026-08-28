import Image from "next/image";
import { useTranslations } from "next-intl";

const ITEMS = [
  { titleKey: "item1Title", descKey: "item1Description", icon: "/images/why-choose-us/icon-doctors.svg" },
  { titleKey: "item2Title", descKey: "item2Description", icon: "/images/why-choose-us/icon-technology.svg" },
  { titleKey: "item3Title", descKey: "item3Description", icon: "/images/why-choose-us/icon-personalized.svg" },
  { titleKey: "item4Title", descKey: "item4Description", icon: "/images/why-choose-us/icon-flexible-booking.svg" },
] as const;

const STATS = [
  { valueKey: "statDoctorsValue", labelKey: "statDoctorsLabel" },
  { valueKey: "statEquipmentValue", labelKey: "statEquipmentLabel" },
  { valueKey: "statPartnersValue", labelKey: "statPartnersLabel" },
  { valueKey: "statCustomersValue", labelKey: "statCustomersLabel" },
] as const;

export function WhyChooseUs() {
  const t = useTranslations("WhyChooseUs");

  return (
    <section className="bg-[var(--color-background-alt)] px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-5 lg:gap-0">
        <div className="flex flex-col items-center gap-2 lg:gap-0 lg:py-4">
          <p className="text-center font-serif text-[10px] tracking-[2.4px] text-[var(--color-accent)] uppercase lg:text-xs">
            {t("eyebrow")}
          </p>
          <h2 className="text-center text-lg font-medium text-[var(--color-accent)] lg:py-4 lg:text-5xl">
            {t("heading")}
          </h2>
        </div>

        <div className="grid w-full grid-cols-2 gap-x-2 gap-y-5 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0 lg:py-8">
          {ITEMS.map((item) => (
            <div key={item.titleKey} className="flex flex-col items-center gap-2 lg:gap-0">
              <div className="relative mb-2 flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-background-alt)] shadow-lg lg:mb-0 lg:size-20">
                <span className="relative size-5 lg:size-10">
                  <Image src={item.icon} alt="" fill className="object-contain" sizes="40px" />
                </span>
              </div>
              <p className="text-center text-base font-semibold text-[var(--color-accent)] lg:pb-1 lg:text-lg">
                {t(item.titleKey)}
              </p>
              <p className="text-center text-[10px] text-[rgba(99,43,14,0.7)] lg:pt-3 lg:text-sm">{t(item.descKey)}</p>
            </div>
          ))}
        </div>

        <div className="grid w-full grid-cols-2 gap-x-2 gap-y-4 rounded-3xl bg-[var(--foreground)] px-3 pt-2 pb-[20px] sm:px-4 sm:py-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0 lg:px-2 lg:py-6">
          {STATS.map((stat) => (
            <div key={stat.valueKey} className="flex flex-col items-center gap-2 lg:gap-0">
              <p className="font-cormorant text-center text-[48px] leading-none font-semibold text-[var(--color-background-alt)] sm:text-[56px] lg:text-[64px]">
                {t(stat.valueKey)}
              </p>
              <p className="text-center text-[10px] text-white/80 sm:text-xs lg:py-4 lg:text-base xl:text-xl">
                {t(stat.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
