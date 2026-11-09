import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // A webhook-triggered render must not cache the API CDN's pre-publish response until the next publish.
  useCdn: false,
});
