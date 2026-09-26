"use client";

import StackingCards, { StackingCardItem } from "@/components/fancy/blocks/stacking-cards";
import { doctorPortableTextComponents, portableTextContainerClasses } from "@/components/portable-text-components";
import { Link } from "@/i18n/navigation";
import type { DoctorProfile } from "@/sanity/lib/doctors";
import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// A card must fit the viewport for the stacking to work, so a long bio gets
// bounded. The fade only appears when text is actually cut off — drawn
// unconditionally it dims the closing line of bios that fit.
function DoctorBio({ introduction }: { introduction: PortableTextBlock[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isClipped, setIsClipped] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const check = () => setIsClipped(box.scrollHeight > box.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="relative min-h-0 w-full flex-initial overflow-hidden">
      <div className={`${portableTextContainerClasses} text-xs text-[rgba(99,43,14,0.7)] sm:text-sm lg:text-base`}>
        <PortableText value={introduction} components={doctorPortableTextComponents} />
      </div>
      {isClipped && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent"
        />
      )}
    </div>
  );
}

export function DoctorProfiles({ doctors }: { doctors: DoctorProfile[] }) {
  const t = useTranslations("About");

  if (doctors.length === 0) return null;

  return (
    <section className="bg-[var(--color-background-alt)] px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-8 sm:gap-10 lg:gap-12">
        <h2 className="text-center text-xl font-medium text-[var(--color-accent)] sm:text-2xl md:text-3xl lg:text-5xl">
          {t("doctorsHeading")}
        </h2>

        <StackingCards totalCards={doctors.length} className="w-full">
          {doctors.map((doctor, index) => {
            return (
              // Wrappers must all be the SAME height: a sticky item releases once
              // `containerBottom - itemHeight` passes its pin line, so a taller
              // neighbour releases earlier and visibly slides while another card is
              // still pinned. The top offsets clear the sticky site header (60px,
              // 100px at lg) — the component's own `top-0` would pin cards under it.
              <StackingCardItem
                key={doctor.id}
                index={index}
                topPosition={`${index * 16}px`}
                className="top-16 h-[86vh] sm:h-[88vh] lg:top-28 lg:h-[84vh]"
              >
                <div className="flex h-[80vh] flex-col overflow-hidden rounded-3xl bg-white shadow-xl sm:h-[80vh] lg:h-[76vh] lg:flex-row-reverse">
                  <div className="relative aspect-[3/2] w-full shrink-0 sm:aspect-[2/1] lg:aspect-auto lg:w-2/5">
                    <Image
                      src={doctor.imageUrl}
                      alt=""
                      fill
                      className="object-cover object-top"
                      sizes="(min-width: 1024px) 480px, 100vw"
                    />
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 p-4 text-center sm:gap-3 sm:p-6 lg:items-start lg:p-10 lg:text-left">
                    <h3 className="text-lg font-semibold text-[var(--color-accent)] sm:text-xl md:text-2xl lg:text-3xl">
                      {doctor.name}
                    </h3>
                    <p className="text-sm font-medium text-[var(--color-gold)] sm:text-base lg:text-lg">
                      {doctor.title}
                    </p>
                    {doctor.subtitle && (
                      <p className="font-serif text-xs text-[var(--color-muted)] italic sm:text-sm">
                        {doctor.subtitle}
                      </p>
                    )}
                    {doctor.languages && (
                      <p className="text-xs text-[var(--color-muted)] sm:text-sm">{doctor.languages}</p>
                    )}
                    {doctor.introduction.length > 0 && <DoctorBio introduction={doctor.introduction} />}
                    {doctor.slug && (
                      <Link
                        href={{ pathname: "/about/[slug]", params: { slug: doctor.slug } }}
                        className="mt-1 shrink-0 rounded-full border-2 border-[var(--color-accent)] px-4 py-2 text-xs font-bold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] sm:px-5 sm:text-sm lg:text-base"
                      >
                        {t("doctorCta")}
                      </Link>
                    )}
                  </div>
                </div>
              </StackingCardItem>
            );
          })}
          {/* A sticky item can only stay pinned while its container extends below it,
              and the last card IS the container's last child — without this spacer its
              pin range is zero and it scrolls straight past instead of landing. */}
          <div aria-hidden className="h-[10vh]" />
        </StackingCards>
      </div>
    </section>
  );
}
