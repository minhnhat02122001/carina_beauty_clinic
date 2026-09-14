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
    <div className="flex flex-col gap-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className={`rounded-2xl bg-white transition-shadow duration-300 ${
              isOpen ? "shadow-[0px_6px_18px_0px_rgba(99,43,14,0.08)]" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-bold transition-colors hover:text-[var(--color-accent)] sm:px-5 lg:text-base ${
                isOpen ? "text-[var(--color-accent)]" : "text-[var(--foreground)]"
              }`}
            >
              {faq.question}
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-gold)_15%,transparent)] text-[var(--color-accent)]">
                <ChevronIcon
                  className={`size-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>
            <div
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 text-sm leading-relaxed text-[var(--foreground)] sm:px-5 sm:pb-5">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
