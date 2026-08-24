import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

export const treatmentPortableTextComponents: PortableTextComponents = {
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
