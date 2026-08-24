"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { categoryRootHref, treatmentHref, type TreatmentCategory, type TreatmentDetail } from "@/sanity/lib/service";
import { RegistrationForm } from "../../app/[locale]/_home-sections/registration-form";
import { Carousel } from "@/components/carousel";
import { Section } from "./section";
import { TreatmentContent } from "./treatment-content";
import { TreatmentOverview } from "./treatment-overview";

export function TreatmentDetailView({
  treatment,
  category,
  comingSoonLabel,
  homeLabel,
  categoryLabel,
  durationLabel,
  technologyLabel,
  suitableForLabel,
  downtimeLabel,
  reviewedByLabel,
  faqHeading,
  relatedHeading,
  bookingCta,
  scrollPrevLabel,
  scrollNextLabel,
}: {
  treatment: TreatmentDetail;
  category: TreatmentCategory;
  comingSoonLabel: string;
  homeLabel: string;
  categoryLabel: string;
  durationLabel: string;
  technologyLabel: string;
  suitableForLabel: string;
  downtimeLabel: string;
  reviewedByLabel: string;
  faqHeading: string;
  relatedHeading: string;
  bookingCta: string;
  scrollPrevLabel: string;
  scrollNextLabel: string;
}) {
  return (
    <>
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:max-w-5xl lg:px-0 lg:py-16">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-[var(--color-muted)]">
          <Link href="/" className="hover:opacity-70">
            {homeLabel}
          </Link>
          <span>/</span>
          <Link href={categoryRootHref(category)} className="hover:opacity-70">
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">{treatment.name}</span>
        </nav>

        <TreatmentOverview
          treatment={treatment}
          comingSoonLabel={comingSoonLabel}
          durationLabel={durationLabel}
          technologyLabel={technologyLabel}
          suitableForLabel={suitableForLabel}
          downtimeLabel={downtimeLabel}
          reviewedByLabel={reviewedByLabel}
          bookingCta={bookingCta}
          scrollPrevLabel={scrollPrevLabel}
          scrollNextLabel={scrollNextLabel}
        />

        <TreatmentContent sections={treatment.sections} faqs={treatment.faqs} faqHeading={faqHeading} />

        {treatment.relatedTreatments.length > 0 && (
          <Section title={relatedHeading}>
            <Carousel prevLabel={scrollPrevLabel} nextLabel={scrollNextLabel} itemsPerView={{ base: 2, lg: 3 }}>
              {treatment.relatedTreatments.map((item) => (
                <Link
                  key={item.id}
                  href={treatmentHref(category, item.slug)}
                  className="flex flex-col items-center gap-2 rounded-lg hover:opacity-90"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, 50vw"
                      />
                    )}
                  </div>
                  <p className="text-center text-sm font-semibold text-[var(--color-accent)]">{item.name}</p>
                </Link>
              ))}
            </Carousel>
          </Section>
        )}
      </article>
      <RegistrationForm />
    </>
  );
}
