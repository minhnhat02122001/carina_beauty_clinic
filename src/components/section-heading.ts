/**
 * Section-level <h2> on the About page and the shared sections it uses on other pages. Kept in
 * one place because the sizes had drifted section by section (24px to 48px on desktop for
 * headings of the same rank), the same reason `portableTextContainerClasses` exists for
 * paragraph spacing.
 *
 * The ladder matches the home page's, so these headings line up with the home page's own
 * sections wherever they appear together.
 */
// leading-snug is explicit because Tailwind pairs text-5xl with a line-height of 1 — fine for a
// heading that fits one line, cramped for any that wraps.
export const sectionHeadingClasses =
  "text-center text-xl leading-snug font-medium text-[var(--color-accent)] sm:text-2xl md:text-3xl lg:text-5xl";
