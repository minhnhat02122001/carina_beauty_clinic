import { client } from "./client";
import { urlFor } from "./image";

export type BannerItem = {
  id: string;
  imageDesktopUrl: string;
  imageMobileUrl: string;
  url: string | null;
};

const HERO_BANNERS_QUERY = `*[_type == "heroBanner"] | order(order asc){
  _id,
  imageDesktop,
  imageMobile,
  url
}`;

export async function getHeroBanners(): Promise<BannerItem[]> {
  const banners = await client.fetch<
    {
      _id: string;
      imageDesktop: Parameters<typeof urlFor>[0];
      imageMobile: Parameters<typeof urlFor>[0];
      url: string | null;
    }[]
  >(HERO_BANNERS_QUERY);

  return banners.map((item) => ({
    id: item._id,
    imageDesktopUrl: urlFor(item.imageDesktop).width(1920).url(),
    imageMobileUrl: urlFor(item.imageMobile).width(750).url(),
    url: item.url,
  }));
}
