import Image from "next/image";
import { useTranslations } from "next-intl";

export function StrategicPartners() {
  const t = useTranslations("StrategicPartners");

  return (
    <section
      className="px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgb(250, 249, 246) 0%, rgb(252, 234, 192) 16.346%, rgb(252, 235, 195) 47.115%, rgb(255, 238, 199) 61.058%, rgb(255, 241, 210) 81.25%, rgb(255, 255, 255) 97.596%)",
      }}
    >
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-6 lg:gap-8">
        <h2 className="text-center text-2xl font-medium text-[var(--color-accent)] lg:text-5xl">{t("heading")}</h2>

        <div className="relative aspect-[1216/628] w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/partners/partners-grid.png"
            alt=""
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 1216px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
