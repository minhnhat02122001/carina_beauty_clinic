import Image from "next/image";
import { useTranslations } from "next-intl";
import { Carousel } from "@/components/carousel";

const MACHINES = [
  { machine: "/images/equipment/machine-1.png", logo: "/images/equipment/logo-1.png" },
  { machine: "/images/equipment/machine-2.png", logo: "/images/equipment/logo-2.png" },
  { machine: "/images/equipment/machine-4.png", logo: "/images/equipment/logo-4.png" },
  { machine: "/images/equipment/machine-3.png", logo: "/images/equipment/logo-3.png" },
  { machine: "/images/equipment/machine-2.png", logo: "/images/equipment/logo-2.png" },
  { machine: "/images/equipment/machine-4.png", logo: "/images/equipment/logo-4.png" },
] as const;

export function Equipment() {
  const t = useTranslations("Equipment");

  return (
    <section className="bg-[var(--color-background-alt)] px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-medium text-[var(--color-accent)] lg:text-5xl">{t("heading")}</h2>
          <p className="text-xs text-[rgba(99,43,14,0.7)] lg:text-xl">{t("subheading")}</p>
        </div>

        <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")} itemsPerView={{ base: 2, lg: 4 }}>
          {MACHINES.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="relative aspect-[272/363] w-full">
                <Image src={item.machine} alt="" fill className="object-contain" sizes="(min-width: 1024px) 272px, 167px" />
              </div>
              <div className="relative h-12 w-full lg:h-16">
                <Image src={item.logo} alt="" fill className="object-contain" sizes="272px" />
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
