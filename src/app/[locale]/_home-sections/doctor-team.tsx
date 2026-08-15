import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Carousel } from "@/components/carousel";

export function DoctorTeam() {
  const t = useTranslations("DoctorTeam");

  const doctors = [
    { nameKey: "doctor1Name", titleKey: "titleLevel1", image: "/images/team/doctor-le-tuan-anh.png" },
    { nameKey: "doctor2Name", titleKey: "titleLevel1", image: "/images/team/doctor-bui-duc-trung.png" },
    { nameKey: "doctor3Name", titleKey: "titleLevel1", image: "/images/team/doctor-dang-van-tri.png" },
    { nameKey: "doctor4Name", titleKey: "titleLevel2", image: "/images/team/doctor-bui-duc-trung.png" },
  ] as const;

  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-8">
        <h2 className="text-2xl font-medium text-[var(--color-accent)] lg:text-5xl">{t("heading")}</h2>

        <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")} itemsPerView={{ base: 2, lg: 4 }}>
          {doctors.map((doctor, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-accent)]"
            >
              <div className="relative aspect-[295/369] w-full overflow-hidden rounded-lg">
                <Image src={doctor.image} alt="" fill className="object-cover object-top" sizes="(min-width: 1024px) 295px, 220px" />
              </div>
              <p className="text-center text-base font-semibold text-[var(--color-accent)]">{t(doctor.nameKey)}</p>
              <p className="pb-2 text-center text-sm font-medium tracking-[0.14px] text-[#6b7280]">
                {t(doctor.titleKey)}
              </p>
            </div>
          ))}
        </Carousel>

        <div className="flex items-center justify-center gap-4 px-2">
          <Link
            href="/about"
            className="whitespace-nowrap rounded-full border border-[var(--color-accent)] bg-white px-3 py-2 text-center text-xs font-bold tracking-[0.16px] text-[#50260e] hover:opacity-80 sm:px-4 sm:text-sm lg:text-base"
          >
            {t("ctaMore")}
          </Link>
          <Link
            href="/booking"
            className="whitespace-nowrap rounded-full bg-[var(--color-accent)] px-3 py-2 text-center text-xs font-bold tracking-[0.16px] text-[#fcfcfc] hover:opacity-90 sm:px-4 sm:text-sm lg:text-base"
          >
            {t("ctaBooking")}
          </Link>
        </div>
      </div>
    </section>
  );
}
