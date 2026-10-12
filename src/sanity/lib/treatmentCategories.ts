// Single source of truth for the site's 6 fixed treatment categories — each
// is hardcoded into its own URL prefix (treatmentHref/categoryRootHref below),
// so this list isn't meant to grow without code changes too.
//
// Keep this module free of the Sanity client: client components (nav, treatment
// detail) import the href helpers from here, and anything they import ships to
// the browser on every page.
export const TREATMENT_CATEGORIES = [
  { value: "exclusive", settingsKey: "exclusive", title: "Độc quyền" },
  { value: "lifting-rejuvenation", settingsKey: "liftingRejuvenation", title: "Nâng cơ - xoá nhăn" },
  { value: "skin-therapy", settingsKey: "skinTherapy", title: "Điều trị da" },
  { value: "rejuvenation-injections", settingsKey: "rejuvenationInjections", title: "Tiêm trẻ hóa" },
  { value: "body-care", settingsKey: "bodyCare", title: "Chăm sóc vóc dáng" },
  { value: "skin-care", settingsKey: "skinCare", title: "Chăm sóc da, cơ thể" },
] as const;

export type TreatmentCategory = (typeof TREATMENT_CATEGORIES)[number]["value"];
export type NavigationSettingsKey = (typeof TREATMENT_CATEGORIES)[number]["settingsKey"];

export const CATEGORY_OPTIONS = TREATMENT_CATEGORIES.map(({ value, title }) => ({ value, title }));

export function categoryToSettingsKey(category: TreatmentCategory): NavigationSettingsKey {
  return TREATMENT_CATEGORIES.find((c) => c.value === category)!.settingsKey;
}

export function treatmentHref(category: TreatmentCategory, slug: string) {
  switch (category) {
    case "exclusive":
      return { pathname: "/services/exclusive/[slug]", params: { slug } } as const;
    case "lifting-rejuvenation":
      return { pathname: "/services/lifting-rejuvenation/[slug]", params: { slug } } as const;
    case "skin-therapy":
      return { pathname: "/services/skin-therapy/[slug]", params: { slug } } as const;
    case "rejuvenation-injections":
      return { pathname: "/services/rejuvenation-injections/[slug]", params: { slug } } as const;
    case "body-care":
      return { pathname: "/services/body-care/[slug]", params: { slug } } as const;
    case "skin-care":
      return { pathname: "/services/skin-care/[slug]", params: { slug } } as const;
  }
}

export function categoryRootHref(category: TreatmentCategory) {
  switch (category) {
    case "exclusive":
      return "/services/exclusive" as const;
    case "lifting-rejuvenation":
      return "/services/lifting-rejuvenation" as const;
    case "skin-therapy":
      return "/services/skin-therapy" as const;
    case "rejuvenation-injections":
      return "/services/rejuvenation-injections" as const;
    case "body-care":
      return "/services/body-care" as const;
    case "skin-care":
      return "/services/skin-care" as const;
  }
}
