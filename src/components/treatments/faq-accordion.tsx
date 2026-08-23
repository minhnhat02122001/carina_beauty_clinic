"use client";

import { useState } from "react";
import type { TreatmentFaq } from "@/sanity/lib/service";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 8" fill="none" className={className} aria-hidden="true">
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaqAccordion({ faqs }: { faqs: TreatmentFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-2">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question} className="rounded-lg">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-bold text-[var(--foreground)] transition-colors hover:text-[var(--color-accent)]"
            >
              {faq.question}
              <ChevronIcon
                className={`size-3 shrink-0 text-[var(--color-accent)] transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <p className="px-4 pb-4 text-sm leading-relaxed text-[var(--foreground)]">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
