# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing website for Carina Beauty Clinic (Vietnamese aesthetic clinic).
Editorial content — posts, treatments, doctors, videos, banners, menu config —
lives in Sanity and is edited through a Studio mounted at `/studio`. The site is
trilingual (`vi` default, `en`, `zh`). There is no booking system and no
relational database: the registration form captures leads into HubSpot.

## Commands

```bash
node .claude/skills/i18n-check/check-parity.js   # message-key parity, all 3 locales
```

There is **no test framework installed** — don't look for one or assume `npm
test` exists. Verify changes by running the dev server and checking the page,
mobile viewport included.

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

## Git

Never create a branch, commit, push, or open/merge a PR on your own initiative —
only when the user asks for that step in so many words. Finish the change, leave
it uncommitted in the working tree, and say what's ready. Permission covers only
the step named: "commit" is not "push", and one approval doesn't carry over to
the next change.

## Rules

@.claude/rules/code-style.md
@.claude/rules/i18n.md

Loaded automatically only when working with matching files (`paths` frontmatter):

- `.claude/rules/sanity.md` — schemas, GROQ, Studio, Portable Text
- `.claude/rules/lead-form.md` — the registration form, `/api/lead`, `/api/services`
