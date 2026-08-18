import { client } from "./client";
import { urlFor } from "./image";

export type EquipmentListItem = {
  id: string;
  machineImageUrl: string;
  logoImageUrl: string;
};

const EQUIPMENT_QUERY = `*[_type == "equipmentItem"] | order(order asc){
  _id,
  machineImage,
  logoImage
}`;

export async function getEquipmentItems(): Promise<EquipmentListItem[]> {
  const items =
    await client.fetch<
      { _id: string; machineImage: Parameters<typeof urlFor>[0]; logoImage: Parameters<typeof urlFor>[0] }[]
    >(EQUIPMENT_QUERY);

  return items.map((item) => ({
    id: item._id,
    // Rendered with object-contain (never cropped) — cap width only, no forced aspect ratio.
    machineImageUrl: urlFor(item.machineImage).width(544).url(),
    logoImageUrl: urlFor(item.logoImage).width(544).url(),
  }));
}
