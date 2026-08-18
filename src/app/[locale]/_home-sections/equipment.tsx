import Image from "next/image";
import { useTranslations } from "next-intl";
import { Carousel } from "@/components/carousel";
import type { EquipmentListItem } from "@/sanity/lib/equipment";

export function Equipment({ items }: { items: EquipmentListItem[] }) {
  const t = useTranslations("Equipment");

  if (items.length === 0) return null;

  return (
    <section className="bg-[var(--color-background-alt)] px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-medium text-[var(--color-accent)] lg:text-5xl">{t("heading")}</h2>
          <p className="text-xs text-[rgba(99,43,14,0.7)] lg:text-xl">{t("subheading")}</p>
        </div>

        <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")} itemsPerView={{ base: 2, lg: 4 }}>
          {items.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-4">
              <div className="relative aspect-[272/363] w-full">
                <Image
                  src={item.machineImageUrl}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 272px, 167px"
                />
              </div>
              <div className="relative h-12 w-full lg:h-16">
                <Image src={item.logoImageUrl} alt="" fill className="object-contain" sizes="272px" />
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
