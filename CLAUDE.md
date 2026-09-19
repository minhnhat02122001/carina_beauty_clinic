# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing website for Carina Beauty Clinic (Vietnamese aesthetic clinic).
Editorial content — posts, treatments, doctors, videos, banners, menu config —
lives in Sanity and is edited through a Studio mounted at `/studio`. The site is
trilingual (`vi` default, `en`, `zh`). There is no booking system and no
relational database: the registration form captures leads into HubSpot.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
next-intl · Sanity · deployed on Vercel.

## Commands

```bash
npm run dev            # dev server (Studio at /studio on the same server)
npm run build
npm run lint           # eslint
npm run format         # prettier --write .  (printWidth 120, tailwind plugin)
npm run format:check

node .claude/skills/i18n-check/check-parity.js   # message-key parity, all 3 locales
```

There is **no test framework installed** — don't look for one or assume `npm
test` exists. Verify changes by running the dev server and checking the page,
mobile viewport included.

## Layout

```
src/app/[locale]/        every page; _home-sections/ holds the homepage's sections
src/app/api/             lead (HubSpot) and services (service picker) routes
src/app/studio/          mounted Sanity Studio
src/i18n/                routing (locales + localized pathnames), navigation, request
src/messages/            vi.json / en.json / zh.json — all UI chrome strings
src/sanity/schemaTypes/  document schemas
src/sanity/lib/          one GROQ query module per content type
src/components/          shared components (blog/, treatments/, doctors/, icons/)
src/lib/                 metadata (hreflang), slugify, small helpers
```

## Environment

`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_SITE_URL`,
`HUBSPOT_ACCESS_TOKEN`, `SANITY_API_READ_TOKEN` / `SANITY_API_WRITE_TOKEN`.

`src/sanity/env.ts` throws on a missing project id or dataset — that's the
usual cause of a hard boot failure.

## Next 16

This Next version diverges from training data: `src/proxy.ts` replaces the
`middleware.ts` convention, and `params` is a Promise. Check
`node_modules/next/dist/docs/` before relying on remembered APIs (see
`AGENTS.md`).

## Rules

@.claude/rules/code-style.md
@.claude/rules/i18n.md

Read on demand, not loaded by default:

- `.claude/rules/sanity.md` — before touching schemas, GROQ, or Portable Text
- `.claude/rules/lead-form.md` — before touching the registration form or `/api/lead`
