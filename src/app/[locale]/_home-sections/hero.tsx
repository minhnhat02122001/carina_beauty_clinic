import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function Stat({ value, label, isMobileLeftColumn }: { value: string; label: string; isMobileLeftColumn: boolean }) {
  return (
    <div
      className={`flex flex-col items-start gap-1 border-[rgba(99,43,14,0.2)] lg:flex-1 lg:border-r-0 lg:pr-0 ${isMobileLeftColumn ? "border-r pr-3" : ""}`}
    >
      <p className="font-cormorant text-2xl font-semibold text-[var(--foreground)] lg:text-[38px]">{value}</p>
      <p className="text-sm text-[rgba(80,38,14,0.6)]">{label}</p>
    </div>
  );
}

function StatDivider() {
  return <div className="hidden bg-[rgba(99,43,14,0.2)] lg:block lg:w-px" />;
}

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="bg-[var(--color-background-alt)]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-8 sm:px-6 md:px-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-28 lg:py-12">
        <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
          <span className="rounded-full bg-[rgba(201,169,97,0.16)] px-3 py-2 text-[10px] font-bold tracking-[2.4px] text-[var(--foreground)] uppercase lg:text-xs">
            {t("badge")}
          </span>
          <span className="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-[227px] lg:w-[231px]">
            <Image src="/images/logo/logo-icon.png" alt="" fill className="object-contain" sizes="231px" />
          </span>
          <h1 className="font-script text-5xl leading-tight text-[var(--color-gold)] lg:text-[76px]">
            {t("scriptHeading")}
          </h1>
          <p className="font-[family-name:var(--font-serif)] text-base font-bold text-[rgba(80,38,14,0.7)] lg:text-xl">
            {t("tagline")}
          </p>
          <p className="max-w-xl text-xs text-[rgba(80,38,14,0.7)] lg:text-base">{t("description1")}</p>
          <p className="max-w-xl text-xs text-[rgba(80,38,14,0.7)] lg:text-base">{t("description2")}</p>
          <div className="grid grid-cols-2 gap-3 pt-2 lg:flex lg:gap-4">
            <Link
              href="/about"
              className="rounded-full border-2 border-[var(--color-accent)] px-3 py-2 text-center text-xs font-bold whitespace-nowrap text-[var(--color-accent)] hover:opacity-80 sm:px-4 sm:text-sm lg:px-[50px] lg:py-2.5 lg:text-base"
            >
              {t("ctaMore")}
            </Link>
            <Link
              href={{ pathname: "/", hash: "registration-form" }}
              className="rounded-full border-2 border-[var(--color-accent)] bg-[#50260e] px-3 py-2 text-center text-xs font-bold whitespace-nowrap text-[var(--color-background-alt)] hover:opacity-90 sm:px-4 sm:text-sm lg:px-[18px] lg:py-2.5 lg:text-base"
            >
              {t("ctaBooking")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2 pt-4 lg:flex lg:gap-2">
            <Stat value={t("statDoctorsValue")} label={t("statDoctorsLabel")} isMobileLeftColumn />
            <StatDivider />
            <Stat value={t("statEquipmentValue")} label={t("statEquipmentLabel")} isMobileLeftColumn={false} />
            <StatDivider />
            <Stat value={t("statPartnersValue")} label={t("statPartnersLabel")} isMobileLeftColumn />
            <StatDivider />
            <Stat value={t("statCustomersValue")} label={t("statCustomersLabel")} isMobileLeftColumn={false} />
          </div>
        </div>
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/hero/hero-building.png"
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 584px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
