import { client } from "./client";
import { urlFor } from "./image";
import type { Locale } from "@/i18n/routing";
import { CLINIC_NAME } from "@/lib/clinic";

export type BannerItem = {
  id: string;
  imageDesktopUrl: string;
  imageMobileUrl: string;
  url: string | null;
  alt: string;
};

const LOCALIZED_ALT = `select($locale == "vi" => alt, $locale == "zh" => coalesce(altZh, alt), coalesce(altEn, alt))`;

const HERO_BANNERS_QUERY = `*[_type == "heroBanner"] | order(order asc){
  _id,
  imageDesktop,
  imageMobile,
  url,
  "alt": ${LOCALIZED_ALT}
}`;

export async function getHeroBanners(locale: Locale): Promise<BannerItem[]> {
  const banners = await client.fetch<
    {
      _id: string;
      imageDesktop: Parameters<typeof urlFor>[0];
      imageMobile: Parameters<typeof urlFor>[0];
      url: string | null;
      alt: string | null;
    }[]
  >(HERO_BANNERS_QUERY, { locale });

  return banners.map((item) => ({
    id: item._id,
    imageDesktopUrl: urlFor(item.imageDesktop).width(1920).url(),
    imageMobileUrl: urlFor(item.imageMobile).width(750).url(),
    url: item.url,
    alt: item.alt || CLINIC_NAME,
  }));
}
