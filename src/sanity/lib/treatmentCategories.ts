// Single source of truth for the site's 6 fixed treatment categories — each
// is hardcoded into its own URL prefix elsewhere (treatmentHref/categoryRootHref
// in service.ts), so this list isn't meant to grow without code changes too.
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
