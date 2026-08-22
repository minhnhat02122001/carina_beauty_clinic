import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import type { TreatmentDetail } from "@/sanity/lib/service";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-base leading-relaxed text-[var(--foreground)]">{children}</p>,
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

export function TreatmentDetailView({ treatment, comingSoonLabel }: { treatment: TreatmentDetail; comingSoonLabel: string }) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-0 lg:py-16">
      <h1 className="text-2xl font-semibold text-[var(--color-accent)] lg:text-4xl">{treatment.name}</h1>

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

      {treatment.body.length > 0 ? (
        <div className="flex flex-col gap-4">
          <PortableText value={treatment.body} components={components} />
        </div>
      ) : (
        <p className="text-base text-[var(--color-muted)]">{comingSoonLabel}</p>
      )}
    </article>
  );
}
