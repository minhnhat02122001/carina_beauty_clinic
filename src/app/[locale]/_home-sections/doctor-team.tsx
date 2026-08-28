"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Carousel } from "@/components/carousel";
import { scrollToRegistrationForm } from "@/lib/scroll-to-registration-form";
import type { DoctorItem } from "@/sanity/lib/doctors";

export function DoctorTeam({ doctors }: { doctors: DoctorItem[] }) {
  const t = useTranslations("DoctorTeam");

  if (doctors.length === 0) return null;

  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-8">
        <h2 className="text-2xl font-medium text-[var(--color-accent)] lg:text-5xl">{t("heading")}</h2>

        <Carousel prevLabel={t("scrollPrev")} nextLabel={t("scrollNext")} itemsPerView={{ base: 2, lg: 4 }}>
          {doctors.map((doctor) => (
            <Link
              key={doctor.id}
              href={doctor.slug ? { pathname: "/about/[slug]", params: { slug: doctor.slug } } : "/about"}
              className="group flex h-full flex-col items-center gap-2 overflow-hidden rounded-lg border-2 border-[var(--color-accent)] shadow-sm transition-shadow hover:border-[var(--color-gold)] hover:shadow-lg"
            >
              <div className="relative aspect-[295/369] w-full overflow-hidden">
                <Image
                  src={doctor.imageUrl}
                  alt=""
                  fill
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-110"
                  sizes="(min-width: 1024px) 295px, 220px"
                />
              </div>
              <p className="text-center text-base font-semibold text-[var(--color-accent)] transition-colors group-hover:text-[var(--color-gold)]">
                {doctor.name}
              </p>
              <p className="pb-2 text-center text-sm font-medium tracking-[0.14px] text-[#6b7280]">{doctor.title}</p>
            </Link>
          ))}
        </Carousel>

        <div className="flex items-center justify-center gap-4 px-2">
          <Link
            href="/about"
            className="rounded-full border border-[var(--color-accent)] bg-white px-3 py-2 text-center text-xs font-bold tracking-[0.16px] whitespace-nowrap text-[#50260e] hover:opacity-80 sm:px-4 sm:text-sm lg:text-base"
          >
            {t("ctaMore")}
          </Link>
          <Link
            href={{ pathname: "/", hash: "registration-form" }}
            onClick={scrollToRegistrationForm}
            className="rounded-full bg-[var(--color-accent)] px-3 py-2 text-center text-xs font-bold tracking-[0.16px] whitespace-nowrap text-[#fcfcfc] hover:opacity-90 sm:px-4 sm:text-sm lg:text-base"
          >
            {t("ctaBooking")}
          </Link>
        </div>
      </div>
    </section>
  );
}
