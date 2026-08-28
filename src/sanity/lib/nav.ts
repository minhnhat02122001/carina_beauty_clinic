import { client } from "./client";

export type NavigationSettings = {
  showExclusive: boolean;
  showLiftingRejuvenation: boolean;
  showSkinTherapy: boolean;
  showRejuvenationInjections: boolean;
  showBodyCare: boolean;
  showSkinCare: boolean;
};

// Falls back to "everything visible" when the singleton hasn't been created
// yet in Sanity, so the nav never silently loses links before setup.
const DEFAULT_NAVIGATION_SETTINGS: NavigationSettings = {
  showExclusive: true,
  showLiftingRejuvenation: true,
  showSkinTherapy: true,
  showRejuvenationInjections: true,
  showBodyCare: true,
  showSkinCare: true,
};

const NAVIGATION_SETTINGS_QUERY = `*[_type == "navigationSettings"][0]{
  showExclusive,
  showLiftingRejuvenation,
  showSkinTherapy,
  showRejuvenationInjections,
  showBodyCare,
  showSkinCare
}`;

export async function getNavigationSettings(): Promise<NavigationSettings> {
  const settings = await client.fetch<Partial<NavigationSettings> | null>(NAVIGATION_SETTINGS_QUERY);

  return {
    showExclusive: settings?.showExclusive ?? DEFAULT_NAVIGATION_SETTINGS.showExclusive,
    showLiftingRejuvenation: settings?.showLiftingRejuvenation ?? DEFAULT_NAVIGATION_SETTINGS.showLiftingRejuvenation,
    showSkinTherapy: settings?.showSkinTherapy ?? DEFAULT_NAVIGATION_SETTINGS.showSkinTherapy,
    showRejuvenationInjections:
      settings?.showRejuvenationInjections ?? DEFAULT_NAVIGATION_SETTINGS.showRejuvenationInjections,
    showBodyCare: settings?.showBodyCare ?? DEFAULT_NAVIGATION_SETTINGS.showBodyCare,
    showSkinCare: settings?.showSkinCare ?? DEFAULT_NAVIGATION_SETTINGS.showSkinCare,
  };
}
