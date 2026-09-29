/**
 * Every section-level <h2> on the About page. Kept in one place because the sizes had drifted
 * section by section (24px to 48px on desktop for headings of the same rank), the same reason
 * `portableTextContainerClasses` exists for paragraph spacing.
 *
 * The ladder matches the home page's, so the two sections this page imports from
 * `_home-sections/` line up with the rest instead of towering over them.
 */
// leading-snug is explicit because Tailwind pairs text-5xl with a line-height of 1 — fine for a
// heading that fits one line, cramped for any that wraps.
export const sectionHeadingClasses =
  "text-center text-xl leading-snug font-medium text-[var(--color-accent)] sm:text-2xl md:text-3xl lg:text-5xl";
