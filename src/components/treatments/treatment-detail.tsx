"use client";

import { Carousel } from "@/components/carousel";
import { Link } from "@/i18n/navigation";
import { scrollToRegistrationForm } from "@/lib/scroll-to-registration-form";
import { urlFor } from "@/sanity/lib/image";
import { categoryRootHref, treatmentHref, type TreatmentCategory, type TreatmentDetail } from "@/sanity/lib/service";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Clock, Moon, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { RegistrationForm } from "../../app/[locale]/_home-sections/registration-form";
import { FaqAccordion } from "./faq-accordion";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-justify text-base leading-relaxed text-[var(--foreground)]">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="pt-2 text-xl font-semibold text-[var(--color-accent)] lg:text-2xl">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="pt-2 text-lg font-semibold text-[var(--color-accent)]">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[var(--color-border)] pl-4 text-[var(--foreground)] italic opacity-80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="flex flex-col gap-2 pl-5 text-base leading-relaxed text-[var(--foreground)] marker:text-[var(--color-accent)]">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="list-disc">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;

      return (
        <span className="relative my-2 block aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={urlFor(value).width(1200).url()}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 768px, 100vw"
          />
        </span>
      );
    },
  },
};

function Section({
  title,
  children,
  variant = "bordered",
}: {
  title: string;
  children: ReactNode;
  variant?: "bordered" | "alt-a" | "alt-b";
}) {
  const variantClasses =
    variant === "bordered"
      ? "border border-[var(--color-border)]"
      : variant === "alt-a"
        ? "bg-[var(--color-background-alt)]"
        : "bg-white";

  return (
    <section className={`flex flex-col gap-4 rounded-2xl p-5 sm:p-6 lg:p-8 ${variantClasses}`}>
      <h2 className="text-xl font-semibold text-[var(--color-accent)] lg:text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function ReviewerBadge({
  reviewedByLabel,
  doctor,
}: {
  reviewedByLabel: string;
  doctor: NonNullable<TreatmentDetail["reviewedByDoctor"]>;
}) {
  return (
    <div className="flex items-center gap-3 border-y border-[var(--color-border)] py-3">
      {doctor.imageUrl && (
        <span className="relative aspect-square size-12 shrink-0 overflow-hidden rounded-full">
          <Image src={doctor.imageUrl} alt="" fill className="object-cover object-top" sizes="48px" />
        </span>
      )}
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-bold tracking-wide text-[var(--color-muted)] uppercase">{reviewedByLabel}</p>
        <div className="flex flex-wrap items-baseline gap-x-2">
          {doctor.slug ? (
            <Link
              href={{ pathname: "/about/[slug]", params: { slug: doctor.slug } }}
              className="text-sm font-semibold text-[var(--color-accent)] hover:opacity-80"
            >
              {doctor.name}
            </Link>
          ) : (
            <p className="text-sm font-semibold text-[var(--color-accent)]">{doctor.name}</p>
          )}
          <span className="text-xs text-[var(--foreground)]">{doctor.title}</span>
        </div>
      </div>
    </div>
  );
}

function KeyInfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--color-accent)]">
        {icon}
      </span>
      <div className="flex flex-col">
        <p className="text-xs font-bold tracking-wide text-[var(--color-muted)] uppercase">{label}</p>
        <p className="text-sm font-medium text-[var(--foreground)]">{value}</p>
      </div>
    </div>
  );
}

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
  const allKeyInfoRows: { icon: ReactNode; label: string; value: string | null }[] = [
    { icon: <Clock className="size-4" />, label: durationLabel, value: treatment.keyInfo.duration },
    { icon: <Sparkles className="size-4" />, label: technologyLabel, value: treatment.keyInfo.technology },
    { icon: <Users className="size-4" />, label: suitableForLabel, value: treatment.keyInfo.suitableFor },
    { icon: <Moon className="size-4" />, label: downtimeLabel, value: treatment.keyInfo.downtime },
  ];
  const keyInfoRows = allKeyInfoRows.filter(
    (row): row is { icon: ReactNode; label: string; value: string } => row.value !== null,
  );

  return (
    <>
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-0 lg:py-16">
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

        {treatment.imageUrls.length > 0 && (
          <Carousel prevLabel={scrollPrevLabel} nextLabel={scrollNextLabel}>
            {treatment.imageUrls.map((imageUrl, index) => (
              <div key={imageUrl} className="relative aspect-video w-full overflow-hidden rounded-2xl">
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 768px, 100vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </Carousel>
        )}

        <h1 className="text-2xl font-semibold text-[var(--color-accent)] lg:text-4xl">{treatment.name}</h1>

        {treatment.reviewedByDoctor && (
          <ReviewerBadge reviewedByLabel={reviewedByLabel} doctor={treatment.reviewedByDoctor} />
        )}

        {keyInfoRows.length > 0 && (
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[var(--color-border)] p-5 sm:grid-cols-2 sm:p-6">
            {keyInfoRows.map((row) => (
              <KeyInfoRow key={row.label} icon={row.icon} label={row.label} value={row.value} />
            ))}
          </div>
        )}

        {treatment.body.length > 0 ? (
          <div className="flex flex-col gap-4">
            <PortableText value={treatment.body} components={components} />
          </div>
        ) : (
          <p className="text-base text-[var(--color-muted)]">{comingSoonLabel}</p>
        )}

        <Link
          href={{ pathname: "/", hash: "registration-form" }}
          onClick={scrollToRegistrationForm}
          className="inline-flex w-fit items-center justify-center self-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-bold tracking-[0.16px] whitespace-nowrap text-white hover:opacity-90"
        >
          {bookingCta}
        </Link>

        {treatment.sections.map((section, index) => (
          <Section
            key={`${section.heading}-${index}`}
            title={section.heading}
            variant={index % 2 === 0 ? "alt-a" : "alt-b"}
          >
            <PortableText value={section.body} components={components} />
          </Section>
        ))}

        {treatment.faqs.length > 0 && (
          <Section title={faqHeading}>
            <FaqAccordion faqs={treatment.faqs} />
          </Section>
        )}

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
