import { type SchemaTypeDefinition } from "sanity";
import { doctor } from "./doctor";
import { equipmentItem } from "./equipmentItem";
import { heroBanner } from "./heroBanner";
import { post } from "./post";
import { serviceHighlight } from "./serviceHighlight";
import { treatment } from "./treatment";
import { video } from "./video";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, video, treatment, serviceHighlight, heroBanner, doctor, equipmentItem],
};
