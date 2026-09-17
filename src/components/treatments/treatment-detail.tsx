"use client";

import { Carousel } from "@/components/carousel";
import { Link } from "@/i18n/navigation";
import { categoryRootHref, treatmentHref, type TreatmentCategory, type TreatmentDetail } from "@/sanity/lib/service";
import Image from "next/image";
import { RegistrationForm } from "../../app/[locale]/_home-sections/registration-form";
import { Section } from "./section";
import { TreatmentContent } from "./treatment-content";
import { TreatmentOverview } from "./treatment-overview";

export function TreatmentDetailView({
  treatment,
  category,
  comingSoonLabel,
  homeLabel,
  categoryLabel,
  reviewedByLabel,
  faqHeading,
  relatedHeading,
  bookingCta,
  scrollPrevLabel,
  scrollNextLabel,
  closeImageLabel,
}: {
  treatment: TreatmentDetail;
  category: TreatmentCategory;
  comingSoonLabel: string;
  homeLabel: string;
  categoryLabel: string;
  reviewedByLabel: string;
  faqHeading: string;
  relatedHeading: string;
  bookingCta: string;
  scrollPrevLabel: string;
  scrollNextLabel: string;
  closeImageLabel: string;
}) {
  return (
    <>
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8 sm:px-6 lg:max-w-5xl lg:gap-6 lg:px-0 lg:py-16">
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
          reviewedByLabel={reviewedByLabel}
          bookingCta={bookingCta}
          scrollPrevLabel={scrollPrevLabel}
          scrollNextLabel={scrollNextLabel}
          closeImageLabel={closeImageLabel}
        />

        <TreatmentContent sections={treatment.sections} faqs={treatment.faqs} faqHeading={faqHeading} />

        {treatment.relatedTreatments.length > 0 && (
          <Section title={relatedHeading} variant="plain">
            <Carousel prevLabel={scrollPrevLabel} nextLabel={scrollNextLabel} itemsPerView={{ base: 2, lg: 3 }}>
              {treatment.relatedTreatments.map((item) => (
                <Link
                  key={item.id}
                  href={treatmentHref(category, item.slug)}
                  className="group relative block aspect-square w-full [transform:translateZ(0)] overflow-hidden rounded-xl bg-[var(--color-background-alt)] sm:rounded-2xl"
                >
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, 50vw"
                    />
                  )}
                  {/* Tall, near-solid fade because many CMS photos have headline text baked into their bottom third. */}
                  <div className="absolute inset-x-0 bottom-0 flex h-[45%] items-end bg-gradient-to-t from-[rgba(99,43,14,0.97)] from-40% via-[rgba(99,43,14,0.75)] via-50% to-transparent px-3 pb-3 sm:px-4 sm:pb-4">
                    <p className="text-sm font-semibold text-[var(--color-accent-foreground)] sm:text-base lg:text-lg">
                      {item.name}
                    </p>
                  </div>
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
