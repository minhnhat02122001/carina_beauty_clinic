import Image from "next/image";
import { Sparkles } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { Carousel } from "@/components/carousel";
import { Link } from "@/i18n/navigation";
import { scrollToRegistrationForm } from "@/lib/scroll-to-registration-form";
import type { TreatmentDetail } from "@/sanity/lib/service";
import { treatmentPortableTextComponents } from "./portable-text-components";

function ReviewerRow({ doctor }: { doctor: TreatmentDetail["reviewedByDoctors"][number] }) {
  return (
    <div className="flex items-center gap-3">
      {doctor.imageUrl && (
        <span className="relative aspect-square size-12 shrink-0 overflow-hidden rounded-full">
          <Image src={doctor.imageUrl} alt="" fill className="object-cover object-top" sizes="48px" />
        </span>
      )}
      <div className="flex min-w-0 flex-col">
        {doctor.slug ? (
          <Link
            href={{ pathname: "/about/[slug]", params: { slug: doctor.slug } }}
            className="text-sm font-semibold whitespace-nowrap text-[var(--color-accent)] hover:opacity-80"
          >
            {doctor.name}
          </Link>
        ) : (
          <p className="text-sm font-semibold whitespace-nowrap text-[var(--color-accent)]">{doctor.name}</p>
        )}
        <span className="text-xs whitespace-nowrap text-[var(--foreground)]">{doctor.title}</span>
      </div>
    </div>
  );
}

function ReviewerBadge({
  reviewedByLabel,
  doctors,
}: {
  reviewedByLabel: string;
  doctors: TreatmentDetail["reviewedByDoctors"];
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-[var(--color-background-alt)] p-4">
      <p className="text-xs font-bold tracking-wide text-[var(--color-muted)] uppercase">{reviewedByLabel}</p>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-center lg:gap-4">
        {doctors.map((doctor) => (
          <ReviewerRow key={doctor.slug ?? doctor.name} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

function KeyInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold)] text-[var(--color-accent-foreground)]">
        <Sparkles className="size-4" />
      </span>
      <div className="flex flex-col">
        <p className="text-xs font-bold tracking-wide text-[var(--color-accent)] uppercase">{label}</p>
        <p className="text-xs font-medium text-[var(--foreground)]">{value}</p>
      </div>
    </div>
  );
}

export function TreatmentOverview({
  treatment,
  comingSoonLabel,
  reviewedByLabel,
  bookingCta,
  scrollPrevLabel,
  scrollNextLabel,
  closeImageLabel,
}: {
  treatment: TreatmentDetail;
  comingSoonLabel: string;
  reviewedByLabel: string;
  bookingCta: string;
  scrollPrevLabel: string;
  scrollNextLabel: string;
  closeImageLabel: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex w-full flex-col gap-4 lg:w-1/2 lg:shrink-0">
          {treatment.imageUrls.length > 0 && (
            <Carousel
              prevLabel={scrollPrevLabel}
              nextLabel={scrollNextLabel}
              lightboxImages={treatment.imageUrls}
              lightboxCloseLabel={closeImageLabel}
            >
              {treatment.imageUrls.map((imageUrl, index) => (
                // translateZ(0) forces its own compositing layer, so Chrome keeps
                // clipping the image to rounded-2xl mid-scroll instead of
                // briefly showing its square corners during the snap animation.
                <div
                  key={imageUrl}
                  className="relative aspect-square w-full [transform:translateZ(0)] overflow-hidden rounded-2xl bg-[var(--color-background-alt)]"
                >
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </Carousel>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-2xl font-semibold text-[var(--color-accent)] lg:text-4xl">{treatment.name}</h1>

          {treatment.keyInfo.length > 0 && (
            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[var(--color-border)] p-4 sm:grid-cols-2">
              {treatment.keyInfo.map((criterion) => (
                <KeyInfoRow key={criterion.label} label={criterion.label} value={criterion.value} />
              ))}
            </div>
          )}

          {treatment.body.length > 0 ? (
            <div className="flex flex-col gap-4">
              <PortableText value={treatment.body} components={treatmentPortableTextComponents} />
            </div>
          ) : (
            <p className="text-base text-[var(--color-muted)]">{comingSoonLabel}</p>
          )}

          <Link
            href={{ pathname: "/", hash: "registration-form" }}
            onClick={scrollToRegistrationForm}
            className="inline-flex w-fit items-center justify-center self-center rounded-full border-2 border-transparent bg-[var(--color-accent)] px-6 py-3 text-sm font-bold tracking-[0.16px] whitespace-nowrap text-white transition-colors hover:border-[var(--color-accent)] hover:bg-transparent hover:text-[var(--color-accent)]"
          >
            {bookingCta}
          </Link>
        </div>
      </div>

      {treatment.reviewedByDoctors.length > 0 && (
        <ReviewerBadge reviewedByLabel={reviewedByLabel} doctors={treatment.reviewedByDoctors} />
      )}
    </div>
  );
}
