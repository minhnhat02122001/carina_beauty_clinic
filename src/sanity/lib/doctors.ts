import type { Locale } from "@/i18n/routing";
import { client } from "./client";
import { urlFor } from "./image";

export type DoctorItem = {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
};

const DOCTORS_QUERY = `*[_type == "doctor"] | order(order asc){
  _id,
  name,
  "title": select($locale == "vi" => title, $locale == "zh" => coalesce(titleZh, title), coalesce(titleEn, title)),
  image
}`;

export async function getDoctors(locale: Locale): Promise<DoctorItem[]> {
  const doctors = await client.fetch<
    { _id: string; name: string; title: string; image: Parameters<typeof urlFor>[0] }[]
  >(DOCTORS_QUERY, { locale });

  return doctors.map((item) => ({
    id: item._id,
    name: item.name,
    title: item.title,
    imageUrl: urlFor(item.image).width(590).height(738).fit("crop").url(),
  }));
}
