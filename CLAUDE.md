# Carina Beauty Clinic — Website

## Project Overview

Marketing website with online booking for Carina Beauty Clinic. Prospective and
existing clients should be able to learn about services, view a gallery/pricing,
and book an appointment online.

- **Type:** Marketing site + appointment booking
- **Languages:** English + Vietnamese (i18n from the start — don't hardcode
  user-facing strings; route through a translation layer, e.g. `next-intl` or
  `next-i18next`)
- **Hosting/Deploy:** Vercel
- **Branding:** No logo/colors/fonts yet. Until assets are provided, use a
  neutral, clean beauty-clinic-appropriate placeholder palette (soft, warm
  neutrals) and swap in real brand assets later — don't hardcode temporary
  colors/fonts in many places; centralize them (theme file / CSS variables)
  so swapping brand assets later is a small diff.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **i18n:** `next-intl`, locale-prefixed routing (`/en`, `/vi`) via
  `src/proxy.ts` (Next 16 renamed the `middleware` file convention to
  `proxy` — see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`)
- **Booking:** Not yet decided — evaluate whether to build custom (dates +
  slots + a database) vs. embedding a third-party scheduler (e.g. Cal.com).
  Ask before committing to one, since it affects data model and hosting needs.
- **Data storage:** Not yet decided (needed once booking is implemented —
  likely Postgres via a hosted provider that plays well with Vercel, e.g.
  Vercel Postgres/Neon/Supabase)

## Project Structure

- `src/app/[locale]/` — all routes live under the locale segment
  (`page.tsx` = home, plus `services/`, `gallery/`, `about/`, `booking/`,
  `contact/`, each currently a placeholder page).
- `src/i18n/routing.ts` — declares supported locales (`en`, `vi`) and the
  default locale; `src/i18n/navigation.ts` exports locale-aware `Link`,
  `useRouter`, `usePathname`.
- `src/messages/{en,vi}.json` — all user-facing copy. New strings go here
  first (both locales), then get referenced via `useTranslations`/
  `getTranslations` — never inline text in a component.
- `src/components/nav.tsx`, `locale-switcher.tsx` — shared header/nav.
- `src/app/[locale]/globals.css` — centralized theme: placeholder soft/warm
  neutral palette as CSS variables (`--background`, `--foreground`,
  `--color-accent`, `--color-muted`, `--color-border`). Swap values here
  when real brand assets arrive; don't hardcode colors/fonts elsewhere.
- `public/images/` — static image assets, categorized by subfolder:
  `logo/`, `team/` (doctors/staff), `equipment/` (machines), `before-after/`
  (treatment result photos). Reference via `next/image` with a path like
  `/images/team/photo.jpg`; alt text goes through `useTranslations` like any
  other user-facing string, not hardcoded.

## Planned Pages/Sections

- Home
- Services (with pricing)
- Gallery / Before-After (if applicable)
- About / Team
- Booking flow
- Contact / Location
- (Testimonials/reviews and online payments were considered but not
  requested for initial launch — revisit if scope grows)

## Open Questions / Not Yet Decided

- Booking implementation approach (custom vs. third-party like Cal.com)
- Database/backend for storing bookings
- Brand assets (logo, color palette, fonts) — pending from client, currently
  using a placeholder palette in `globals.css`

## Conventions

- Keep components small and colocated with the routes that use them under
  `src/app/[locale]/`.
- No user-facing string should be hardcoded in a component — add the key to
  both `src/messages/en.json` and `src/messages/vi.json` and read it via
  `useTranslations`/`getTranslations`.
- Don't build the booking backend until the approach above is decided —
  ask rather than assuming a data model.
- **Mobile is the priority — never break mobile UI.** Verify any
  layout/sizing change at a real mobile viewport (~375px) before treating it
  as done; don't just implement it and assume it's correct. Prefer relative
  sizing (`w-full`, `aspect-*`, `%`) over fixed pixel widths/heights,
  especially inside variable-width containers like carousel columns — a
  fixed size that looks fine on desktop can overflow or crowd a narrower
  mobile column.

## Rules

@.claude/rules/code-style.md
@.claude/rules/i18n.md
