// Section 2's 3 items describe a real ordered process (draft → medical
// review → publish). Rendered as bordered cards with an overlapping icon
// badge, each step keyed to one of the site's three accent tones so the
// steps read as distinct at a glance without introducing new colors.

const STEP_COLORS = ["var(--color-accent)", "var(--color-accent-bright)", "var(--color-gold)"];

function DraftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6">
      <path d="M12 21s7-3.6 7-9V6l-7-3-7 3v6c0 5.4 7 9 7 9Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function PublishIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6">
      <path d="M12 16V4" />
      <path d="m6.5 9.5 5.5-5.5 5.5 5.5" />
      <rect x="4" y="18" width="16" height="3" rx="1" />
    </svg>
  );
}

const STEP_ICONS = [DraftIcon, ReviewIcon, PublishIcon];

export function ProcessSteps({ steps }: { steps: string[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
      {steps.map((step, index) => {
        const color = STEP_COLORS[index % STEP_COLORS.length];
        const Icon = STEP_ICONS[index % STEP_ICONS.length];
        return (
          <div
            key={step}
            className="relative rounded-2xl border-2 bg-[var(--background)] px-5 pt-10 pb-6 text-center"
            style={{ borderColor: color }}
          >
            <span
              className="absolute left-1/2 top-0 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-[var(--background)]"
              style={{ borderColor: color, color }}
            >
              <Icon />
            </span>
            <p className="text-base leading-relaxed font-medium text-[var(--foreground)]">{step}</p>
          </div>
        );
      })}
    </div>
  );
}
