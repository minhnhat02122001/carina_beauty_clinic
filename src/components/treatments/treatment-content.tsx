import { PortableText } from "@portabletext/react";
import type { TreatmentDetail } from "@/sanity/lib/service";
import { FaqAccordion } from "./faq-accordion";
import { treatmentPortableTextComponents } from "./portable-text-components";
import { Section } from "./section";

export function TreatmentContent({
  sections,
  faqs,
  faqHeading,
}: {
  sections: TreatmentDetail["sections"];
  faqs: TreatmentDetail["faqs"];
  faqHeading: string;
}) {
  return (
    <>
      {sections.map((section, index) => (
        <Section
          key={`${section.heading}-${index}`}
          title={section.heading}
          variant={index % 2 === 0 ? "alt-a" : "alt-b"}
        >
          <PortableText value={section.body} components={treatmentPortableTextComponents} />
        </Section>
      ))}

      {faqs.length > 0 && (
        <Section title={faqHeading}>
          <FaqAccordion faqs={faqs} />
        </Section>
      )}
    </>
  );
}
