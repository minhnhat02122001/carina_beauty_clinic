---
paths:
  - "src/sanity/**"
  - "sanity.config.ts"
  - "src/app/studio/**"
  - "src/components/portable-text-components.tsx"
---

# Sanity Content Layer

All editorial content lives in Sanity, edited through a Studio mounted at
`/studio` (`sanity.config.ts`, `src/app/studio/`).

## Schemas

Studio labels and descriptions are authored in **Vietnamese** — match that when
adding fields.

## Localized fields

The Vietnamese field is the base (`title`, `body`, `name`); English and Chinese
are suffixed siblings (`titleEn`, `titleZh`), separated into Studio field
groups. Queries resolve them through a per-field constant:

```ts
const LOCALIZED_TITLE = `select($locale == "vi" => title, $locale == "zh" => coalesce(titleZh, title), coalesce(titleEn, title))`;
```

See `LOCALIZED_*` in `src/sanity/lib/posts.ts` and `service.ts`. New
translatable fields follow the same pattern. A missing translation falling back
to Vietnamese is intended behaviour, not a bug to fix.

## Query layer

One module per content type in `src/sanity/lib/`, each exporting typed
`get*(locale)` functions that own their GROQ and return finished view models —
image URLs already resolved through `urlFor`, dates already formatted.
**Components never run GROQ**; they receive view models as props.

Other conventions:

- Slugs go through `src/lib/slugify.ts`, which strips Vietnamese diacritics and
  đ/Đ (NFD normalization alone leaves đ intact).
- `src/sanity/lib/treatmentCategories.ts` is the single source of truth for the
  6 fixed treatment categories. Adding one also requires new routes and new
  cases in its `treatmentHref`/`categoryRootHref`. It must never import the
  Sanity `client` — client components import those helpers from it, so anything
  it pulls in ships to the browser on every page.

## Caching and images

`export const revalidate = 60` on `src/app/[locale]/layout.tsx` covers every
page under it, so published edits appear within a minute without a redeploy.

## Portable Text

Every Portable Text field on the site renders through
`createPortableTextComponents()` in `src/components/portable-text-components.tsx`,
which exports three presets (post / treatment / doctor). Change how editor
content looks by editing that factory — never by styling Portable Text at an
individual call site, or rendering drifts page by page.
