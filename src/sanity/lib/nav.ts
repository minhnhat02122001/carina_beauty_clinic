import { toSummary, type RawTreatmentSummary, type TreatmentSubgroupGroup } from "./service";
import { TREATMENT_CATEGORIES, type NavigationSettingsKey } from "./treatmentCategories";
import { client } from "./client";

export type NavigationCategorySettings = {
  show: boolean;
  subgroups: TreatmentSubgroupGroup[];
};

export type NavigationSettings = Record<NavigationSettingsKey, NavigationCategorySettings>;

const LOCALIZED_NAME = `select($locale == "vi" => name, $locale == "zh" => coalesce(nameZh, name), coalesce(nameEn, name))`;
const LOCALIZED_SUBGROUP_LABEL = `select($locale == "vi" => label, $locale == "zh" => coalesce(labelZh, label), coalesce(labelEn, label))`;

// Falls back to "everything visible, no subgroups" when the singleton hasn't
// been created yet in Sanity, so the nav never silently loses links before setup.
const DEFAULT_CATEGORY_SETTINGS: NavigationCategorySettings = { show: true, subgroups: [] };

const NAVIGATION_SETTINGS_QUERY = `*[_type == "navigationSettings"][0]{
  ${TREATMENT_CATEGORIES.map(
    ({ settingsKey }) => `"${settingsKey}": ${settingsKey}{
    show,
    "subgroups": subgroups[]{
      "subgroup": ${LOCALIZED_SUBGROUP_LABEL},
      "items": treatments[]->{
        _id,
        "slug": slug.current,
        "name": ${LOCALIZED_NAME},
        images
      }
    }
  }`,
  ).join(",\n  ")}
}`;

type RawCategorySettings = {
  show?: boolean;
  subgroups?: { subgroup: string | null; items: RawTreatmentSummary[] }[];
};

export async function getNavigationSettings(locale: string): Promise<NavigationSettings> {
  const settings = await client.fetch<Partial<Record<NavigationSettingsKey, RawCategorySettings>> | null>(
    NAVIGATION_SETTINGS_QUERY,
    { locale },
  );

  const result = {} as NavigationSettings;
  for (const { settingsKey } of TREATMENT_CATEGORIES) {
    const raw = settings?.[settingsKey];
    result[settingsKey] = raw
      ? {
          show: raw.show ?? DEFAULT_CATEGORY_SETTINGS.show,
          subgroups: (raw.subgroups ?? []).map((group) => ({
            subgroup: group.subgroup,
            items: group.items.map(toSummary),
          })),
        }
      : DEFAULT_CATEGORY_SETTINGS;
  }
  return result;
}
