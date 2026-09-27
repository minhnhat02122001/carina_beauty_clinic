import { type SchemaTypeDefinition } from "sanity";
import { aboutSettings } from "./aboutSettings";
import { doctor } from "./doctor";
import { equipmentItem } from "./equipmentItem";
import { heroBanner } from "./heroBanner";
import { navigationSettings } from "./navigationSettings";
import { post } from "./post";
import { serviceHighlightsSettings } from "./serviceHighlightsSettings";
import { treatment } from "./treatment";
import { video } from "./video";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    video,
    treatment,
    heroBanner,
    doctor,
    equipmentItem,
    navigationSettings,
    serviceHighlightsSettings,
    aboutSettings,
  ],
};
