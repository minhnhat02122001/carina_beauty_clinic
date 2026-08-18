import { type SchemaTypeDefinition } from "sanity";
import { post } from "./post";
import { video } from "./video";
import { heroBanner } from "./heroBanner";
import { equipmentItem } from "./equipmentItem";
import { serviceHighlight } from "./serviceHighlight";
import { doctor } from "./doctor";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, video, heroBanner, equipmentItem, serviceHighlight, doctor],
};
