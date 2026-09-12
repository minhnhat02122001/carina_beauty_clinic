import { treatmentHref } from "./service";
import { TREATMENT_CATEGORIES, type NavigationSettingsKey } from "./treatmentCategories";
import { client } from "./client";
import { urlFor } from "./image";

export type ServiceHighlightItem = {
  id: string;
  name: string;
  imageUrl: string;
  href: ReturnType<typeof treatmentHref> | null;
};

export type ServiceHighlightsByCategory = Record<NavigationSettingsKey, ServiceHighlightItem[]>;

const LOCALIZED_NAME = `select($locale == "vi" => name, $locale == "zh" => coalesce(nameZh, name), coalesce(nameEn, name))`;

const SERVICE_HIGHLIGHTS_SETTINGS_QUERY = `*[_type == "serviceHighlightsSettings"][0]{
  ${TREATMENT_CATEGORIES.map(
    ({ settingsKey }) => `"${settingsKey}": ${settingsKey}{
    "highlights": highlights[]{
      _key,
      "name": ${LOCALIZED_NAME},
      image,
      "treatmentSlug": treatment->slug.current
    }
  }`,
  ).join(",\n  ")}
}`;

type RawHighlight = {
  _key: string;
  name: string;
  image: Parameters<typeof urlFor>[0];
  treatmentSlug: string | null;
};

export async function getServiceHighlightsSettings(locale: string): Promise<ServiceHighlightsByCategory> {
  const settings = await client.fetch<Partial<Record<NavigationSettingsKey, { highlights?: RawHighlight[] }>> | null>(
    SERVICE_HIGHLIGHTS_SETTINGS_QUERY,
    { locale },
  );

  const result = {} as ServiceHighlightsByCategory;
  for (const { value, settingsKey } of TREATMENT_CATEGORIES) {
    const highlights = settings?.[settingsKey]?.highlights ?? [];
    result[settingsKey] = highlights.map((item) => ({
      id: item._key,
      name: item.name,
      imageUrl: urlFor(item.image).width(768).height(768).fit("crop").url(),
      href: item.treatmentSlug ? treatmentHref(value, item.treatmentSlug) : null,
    }));
  }
  return result;
}
