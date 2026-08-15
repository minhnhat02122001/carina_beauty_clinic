---
description: Scaffold a new locale-aware route under src/app/[locale]/
---

Add a new page named `$ARGUMENTS` to the Carina Beauty Clinic site, following
the pattern already used by `services`, `gallery`, `about`, `booking`, and
`contact`:

1. Create `src/app/[locale]/<name>/page.tsx` — a server component that calls
   `useTranslations("<Namespace>")` and renders a heading + body, matching
   the structure of the existing placeholder pages (see
   `src/app/[locale]/services/page.tsx` for the template).
2. Add a `<Namespace>` object with `heading` and any needed keys to **both**
   `src/messages/en.json` and `src/messages/vi.json` (ask the user for the
   Vietnamese copy if it isn't obvious — don't guess a mistranslation).
3. If this page should appear in the header nav, add it to the `links` array
   in `src/components/nav.tsx` and add the corresponding `Nav.<key>` string
   to both message files.
4. Use `Link` from `@/i18n/navigation` for any internal links, never
   `next/link`.

Run `npx eslint <changed files>` when done.
