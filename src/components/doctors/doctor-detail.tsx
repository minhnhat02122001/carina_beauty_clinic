import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { ReactNode } from "react";
import type { DoctorDetail } from "@/sanity/lib/doctors";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-base leading-relaxed text-[var(--foreground)]">{children}</p>,
    h2: ({ children }) => (
      <h3 className="pt-2 text-lg font-semibold text-[var(--color-accent)] lg:text-xl">{children}</h3>
    ),
    h3: ({ children }) => <h4 className="pt-1 text-base font-semibold text-[var(--color-accent)]">{children}</h4>,
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
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] p-5 sm:p-6 lg:p-8">
      <h2 className="text-xl font-semibold text-[var(--color-accent)] lg:text-2xl">{title}</h2>
      {children}
    </section>
  );
}

export function DoctorDetailView({
  doctor,
  bookingLabel,
  clinicalImagesLabel,
  comingSoonLabel,
}: {
  doctor: DoctorDetail;
  bookingLabel: string;
  clinicalImagesLabel: string;
  comingSoonLabel: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:gap-8 lg:px-0 lg:py-16">
      <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-start lg:gap-10">
        <div className="relative aspect-[295/369] w-full max-w-xs shrink-0 self-center overflow-hidden rounded-2xl lg:w-2/5 lg:max-w-none">
          <Image
            src={doctor.imageUrl}
            alt=""
            fill
            className="object-cover object-top"
            sizes="(min-width: 1024px) 40vw, 60vw"
            priority
          />
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-accent)] lg:text-4xl">{doctor.name}</h1>
            <p className="text-base text-[var(--foreground)]">{doctor.title}</p>
            {doctor.subtitle && <p className="text-sm text-[var(--color-muted)] italic">{doctor.subtitle}</p>}
          </div>

          {doctor.nationality && <p className="text-sm text-[var(--color-muted)]">{doctor.nationality}</p>}

          {doctor.introduction.length > 0 ? (
            <div className="flex flex-col gap-3">
              <PortableText value={doctor.introduction} components={components} />
            </div>
          ) : (
            <p className="text-base text-[var(--color-muted)]">{comingSoonLabel}</p>
          )}

          <a
            href="#registration-form"
            className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-bold tracking-[0.16px] whitespace-nowrap text-white hover:opacity-90"
          >
            {bookingLabel}
          </a>
        </div>
      </div>

      {doctor.sections.map((section, index) => (
        <Section key={`${section.heading}-${index}`} title={section.heading}>
          <PortableText value={section.body} components={components} />
        </Section>
      ))}

      {doctor.clinicalImageUrls.length > 0 && (
        <Section title={clinicalImagesLabel}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {doctor.clinicalImageUrls.map((imageUrl) => (
              <div key={imageUrl} className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image src={imageUrl} alt="" fill className="object-cover" sizes="(min-width: 640px) 33vw, 50vw" />
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
