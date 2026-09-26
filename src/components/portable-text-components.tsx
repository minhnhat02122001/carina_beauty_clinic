import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react";
import { PortableTextImage } from "@/components/portable-text-image";

/**
 * Vertical rhythm between editor blocks. Every PortableText call site uses this, so paragraph spacing
 * can't drift page by page (a gap set on a page's own wrapper used to decide it).
 */
export const portableTextContainerClasses = "flex flex-col gap-4 lg:gap-5";

/**
 * One renderer for every Portable Text field on the site (posts, treatments, doctors), so a fix to how
 * editor content renders applies everywhere instead of drifting per page.
 */
export function createPortableTextComponents({
  justify = false,
  headingScale = "article",
}: {
  /** Justify body paragraphs — used where copy sits in narrow columns. */
  justify?: boolean;
  /** "compact" demotes headings a level, for content nested under a page section's own heading. */
  headingScale?: "article" | "compact";
} = {}): PortableTextComponents {
  // whitespace-pre-line keeps Shift+Enter line breaks, which HTML would otherwise collapse.
  const paragraphClasses = `${justify ? "text-justify " : ""}text-base leading-relaxed whitespace-pre-line text-[var(--foreground)]`;
  // w-full and text-left are defensive: a list inherits text-align, and a centring
  // ancestor (the doctor cards centre their copy on mobile) leaves the bullets
  // ragged. Centred list items are never wanted, so pin it here for every caller.
  const listClasses =
    "flex w-full flex-col gap-2 pl-5 text-left text-base leading-relaxed whitespace-pre-line text-[var(--foreground)] marker:text-[var(--color-accent)] [&_ul]:mt-2 [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:pl-5 [&_ul_li]:list-[circle]";
  const headingClasses =
    headingScale === "compact"
      ? {
          h2: "pt-2 text-lg font-semibold text-[var(--color-accent)] lg:text-xl",
          h3: "pt-1 text-base font-semibold text-[var(--color-accent)]",
          h4: "pt-1 text-sm font-semibold text-[var(--color-accent)]",
        }
      : {
          h2: "pt-2 text-xl font-semibold text-[var(--color-accent)] lg:text-2xl",
          h3: "pt-2 text-lg font-semibold text-[var(--color-accent)]",
          h4: "pt-1 text-base font-semibold text-[var(--color-accent)]",
        };

  // Editors leave blank lines for spacing; an empty <p> has no height, losing the gap they saw in Studio.
  function Paragraph({ children, value }: { children?: React.ReactNode; value: PortableTextBlock }) {
    const isBlank = !value.children?.some((child) => "text" in child && String(child.text ?? "").trim() !== "");
    if (isBlank) return <span aria-hidden="true" className="block h-4 lg:h-5" />;
    return <p className={paragraphClasses}>{children}</p>;
  }

  return {
    block: {
      normal: Paragraph,
      // An h1 in the body would compete with the page's own title, so it renders at h2 size.
      h1: ({ children }) => <h2 className={headingClasses.h2}>{children}</h2>,
      h2: ({ children }) =>
        headingScale === "compact" ? (
          <h3 className={headingClasses.h2}>{children}</h3>
        ) : (
          <h2 className={headingClasses.h2}>{children}</h2>
        ),
      h3: ({ children }) =>
        headingScale === "compact" ? (
          <h4 className={headingClasses.h3}>{children}</h4>
        ) : (
          <h3 className={headingClasses.h3}>{children}</h3>
        ),
      h4: ({ children }) =>
        headingScale === "compact" ? (
          <h5 className={headingClasses.h4}>{children}</h5>
        ) : (
          <h4 className={headingClasses.h4}>{children}</h4>
        ),
      h5: ({ children }) => <h5 className={headingClasses.h4}>{children}</h5>,
      h6: ({ children }) => <h6 className={headingClasses.h4}>{children}</h6>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-[var(--color-border)] pl-4 whitespace-pre-line text-[var(--foreground)] italic opacity-80">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      underline: ({ children }) => <span className="underline underline-offset-2">{children}</span>,
      "strike-through": ({ children }) => <span className="line-through">{children}</span>,
      code: ({ children }) => (
        <code className="rounded bg-[var(--color-background-alt)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--color-accent)]">
          {children}
        </code>
      ),
      link: ({ children, value }) => {
        const href = String(value?.href ?? "");
        const isExternal = /^https?:\/\//i.test(href);
        return (
          <a
            href={href}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-medium text-[var(--color-accent-bright)] underline underline-offset-2 hover:opacity-80"
          >
            {children}
          </a>
        );
      },
    },
    list: {
      bullet: ({ children }) => <ul className={listClasses}>{children}</ul>,
      number: ({ children }) => <ol className={listClasses}>{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="list-disc">{children}</li>,
      number: ({ children }) => <li className="list-decimal">{children}</li>,
    },
    types: {
      image: ({ value }) => <PortableTextImage value={value} />,
    },
  };
}

export const postPortableTextComponents = createPortableTextComponents();
export const treatmentPortableTextComponents = createPortableTextComponents({ justify: true });
export const doctorPortableTextComponents = createPortableTextComponents({
  justify: true,
  headingScale: "compact",
});
