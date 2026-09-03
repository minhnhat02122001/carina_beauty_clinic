import type { ReactNode } from "react";

// Shared building blocks for the legal/policy pages (privacy, content, media
// usage) — same plain, linear document layout, just different copy per page.

export function PolicyPage({ heading, intro, children }: { heading: string; intro: string; children: ReactNode }) {
  return (
    <div className="bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-0 lg:py-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-[var(--color-accent)] lg:text-4xl">{heading}</h1>
          <p className="text-base leading-relaxed text-[var(--foreground)]">{intro}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PolicySection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-[var(--color-accent)] lg:text-xl">{heading}</h2>
      {children}
    </section>
  );
}

export function PolicyText({ children }: { children: ReactNode }) {
  return <p className="text-base leading-relaxed text-[var(--foreground)]">{children}</p>;
}

export function PolicyNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl bg-[var(--color-background-alt)] p-4 text-base leading-relaxed text-[var(--foreground)] italic opacity-80">
      {children}
    </p>
  );
}

export function PolicyBulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2 pl-5 text-base leading-relaxed text-[var(--foreground)] marker:text-[var(--color-accent)]">
      {items.map((item) => (
        <li key={item} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function PolicyOrderedList({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col gap-2 pl-5 text-base leading-relaxed text-[var(--foreground)] marker:font-semibold marker:text-[var(--color-accent)]">
      {items.map((item) => (
        <li key={item} className="list-decimal">
          {item}
        </li>
      ))}
    </ol>
  );
}

export function PolicyContactBlock({
  name,
  hotlineLabel,
  hotlineValue,
  emailLabel,
  emailValue,
  addressLabel,
  addressValue,
}: {
  name: string;
  hotlineLabel: string;
  hotlineValue: string;
  emailLabel: string;
  emailValue: string;
  addressLabel: string;
  addressValue: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-[var(--color-background-alt)] p-4 text-base text-[var(--foreground)]">
      <p className="font-semibold text-[var(--color-accent)]">{name}</p>
      <p>
        <span className="font-semibold">{hotlineLabel}:</span> {hotlineValue}
      </p>
      <p>
        <span className="font-semibold">{emailLabel}:</span> {emailValue}
      </p>
      <p>
        <span className="font-semibold">{addressLabel}:</span> {addressValue}
      </p>
    </div>
  );
}
