import { client } from "./client";
import { urlFor } from "./image";

export type BannerItem = {
  id: string;
  imageUrl: string;
  url: string | null;
};

const HERO_BANNERS_QUERY = `*[_type == "heroBanner"] | order(order asc){
  _id,
  image,
  url
}`;

export async function getHeroBanners(): Promise<BannerItem[]> {
  const banners = await client.fetch<{ _id: string; image: Parameters<typeof urlFor>[0]; url: string | null }[]>(
    HERO_BANNERS_QUERY,
  );

  return banners.map((item) => ({
    id: item._id,
    // No fixed height — the component applies different aspect ratios per
    // breakpoint via CSS (object-cover), so the source shouldn't be pre-cropped.
    imageUrl: urlFor(item.image).width(1920).url(),
    url: item.url,
  }));
}
