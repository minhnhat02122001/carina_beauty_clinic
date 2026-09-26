import type { Locale } from "@/i18n/routing";
import { client } from "./client";
import { urlFor } from "./image";
import { extractYoutubeId } from "./videos";

type SanityImageRef = Parameters<typeof urlFor>[0];

export type AboutImage = {
  key: string;
  url: string;
};

export type AboutPressMention = {
  key: string;
  title: string;
  outletName: string | null;
  url: string;
  screenshotUrl: string;
};

export type AboutSettings = {
  introVideoId: string;
  introVideoThumbnailUrl: string | null;
  technologyImages: AboutImage[];
  testimonialImages: AboutImage[];
  pressMentions: AboutPressMention[];
  closingImages: AboutImage[];
};

const LOCALIZED_PRESS_TITLE = `select($locale == "vi" => title, $locale == "zh" => coalesce(titleZh, title), coalesce(titleEn, title))`;

// Image fields left empty in Studio come back as a stub object with no asset,
// which urlFor() throws on — filter them out here rather than at every call site.
const ABOUT_SETTINGS_QUERY = `*[_type == "aboutSettings"][0]{
  introVideoUrl,
  "introVideoThumbnail": select(defined(introVideoThumbnail.asset) => introVideoThumbnail),
  "technologyImages": technologyImages[defined(asset)],
  "testimonialImages": testimonialImages[defined(asset)],
  "pressMentions": pressMentions[defined(screenshot.asset)]{
    _key,
    "title": ${LOCALIZED_PRESS_TITLE},
    outletName,
    url,
    screenshot
  },
  "closingImages": closingImages[defined(asset)]
}`;

type RawImage = SanityImageRef & { _key: string };

type RawAboutSettings = {
  introVideoUrl: string | null;
  introVideoThumbnail: SanityImageRef | null;
  technologyImages: RawImage[] | null;
  testimonialImages: RawImage[] | null;
  pressMentions:
    { _key: string; title: string; outletName: string | null; url: string; screenshot: SanityImageRef }[] | null;
  closingImages: RawImage[] | null;
};

const EMPTY_SETTINGS: AboutSettings = {
  introVideoId: "",
  introVideoThumbnailUrl: null,
  technologyImages: [],
  testimonialImages: [],
  pressMentions: [],
  closingImages: [],
};

function toImages(images: RawImage[] | null, width: number): AboutImage[] {
  return (images ?? []).map((image) => ({ key: image._key, url: urlFor(image).width(width).url() }));
}

export async function getAboutSettings(locale: Locale): Promise<AboutSettings> {
  const settings = await client.fetch<RawAboutSettings | null>(ABOUT_SETTINGS_QUERY, { locale });

  if (!settings) return EMPTY_SETTINGS;

  return {
    introVideoId: extractYoutubeId(settings.introVideoUrl),
    introVideoThumbnailUrl: settings.introVideoThumbnail
      ? urlFor(settings.introVideoThumbnail).width(440).height(780).fit("crop").url()
      : null,
    technologyImages: toImages(settings.technologyImages, 600),
    // Rendered with object-contain so review screenshots of any shape survive uncropped.
    testimonialImages: toImages(settings.testimonialImages, 800),
    pressMentions: (settings.pressMentions ?? []).map((item) => ({
      key: item._key,
      title: item.title,
      outletName: item.outletName ?? null,
      url: item.url,
      screenshotUrl: urlFor(item.screenshot).width(800).height(450).fit("crop").url(),
    })),
    closingImages: toImages(settings.closingImages, 1200),
  };
}
