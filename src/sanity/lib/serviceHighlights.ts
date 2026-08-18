import type { Locale } from "@/i18n/routing";
import { client } from "./client";
import { urlFor } from "./image";

export type ServiceHighlightItem = {
  id: string;
  name: string;
  imageUrl: string;
  categories: string[];
};

const SERVICE_HIGHLIGHTS_QUERY = `*[_type == "serviceHighlight"] | order(order asc){
  _id,
  "name": select($locale == "vi" => name, $locale == "zh" => coalesce(nameZh, name), coalesce(nameEn, name)),
  image,
  categories
}`;

export async function getServiceHighlights(locale: Locale): Promise<ServiceHighlightItem[]> {
  const items = await client.fetch<
    { _id: string; name: string; image: Parameters<typeof urlFor>[0]; categories: string[] }[]
  >(SERVICE_HIGHLIGHTS_QUERY, { locale });

  return items.map((item) => ({
    id: item._id,
    name: item.name,
    imageUrl: urlFor(item.image).width(768).height(768).fit("crop").url(),
    categories: item.categories,
  }));
}
