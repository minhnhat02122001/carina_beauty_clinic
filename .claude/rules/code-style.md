# Code Style

- Components are small and colocated with the route that uses them, under
  `src/app/[locale]/`. Shared components go in `src/components/`.
- Never hardcode a color or font. All theme values are CSS variables in
  `src/app/[locale]/globals.css` (`--background`, `--foreground`,
  `--color-accent`, `--color-muted`, `--color-border`). Reference them via
  Tailwind (`bg-[var(--color-accent)]`) or the `@theme inline` tokens —
  never a literal hex value in a component.
- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
- No comments explaining what code does — only for non-obvious _why_
  (a workaround, a hidden constraint).

## Responsive: mobile-first, granular, fluid

- Base (unprefixed) Tailwind classes target mobile. Add `sm:`/`md:`/`lg:`/`xl:`
  progressively — don't jump straight from mobile styles to a single `lg:`
  desktop override. Text, spacing, and icon sizes should step up gradually
  across breakpoints rather than hard-swapping between two fixed layouts.
- When implementing a Figma frame that only has Mobile/Desktop variants,
  treat those as the two ends of the ladder (mobile spec ≈ base/`sm:`,
  desktop spec ≈ `lg:`/`xl:`), not as the only two states.
- Images/icons: prefer a relative-sized wrapper (`aspect-[W/H]`, `size-*`,
  `h-*`) with `<Image fill className="object-contain" sizes="...">` over
  fixed numeric `width`/`height` props, so they scale with their container
  instead of staying pixel-locked.
- This applies to Tailwind fixed widths too (`w-32`, `w-40`, etc.), not just
  the `width`/`height` props — a fixed Tailwind size inside a variable-width
  container (e.g. a carousel column, which shrinks on mobile) can overflow
  or crowd it even though it looked fine at the breakpoint you tested. Never
  treat a sizing/layout change as done without checking a real mobile
  viewport (~375px); mobile is the priority and must not break.
