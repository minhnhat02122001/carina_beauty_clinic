import type { Locale } from "@/i18n/routing";
import { client } from "./client";
import { urlFor } from "./image";

export type VideoItem = {
  id: string;
  caption: string;
  thumbnailUrl: string | null;
  videoId: string;
};

const FEATURED_VIDEOS_LIMIT = 10;
const FEATURED_VIDEOS_QUERY = `*[_type == "video" && featured == true] | order(publishedAt desc)[0...${FEATURED_VIDEOS_LIMIT}]{
  _id,
  "caption": select($locale == "vi" => description, $locale == "zh" => coalesce(descriptionZh, description), coalesce(descriptionEn, description)),
  thumbnail,
  youtubeUrl
}`;

// Editors paste whatever URL YouTube gives them (watch?v=, youtu.be/, /shorts/,
// with tracking params like ?si=) — normalize all of them down to a bare video ID.
function extractYoutubeId(url: string | null): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }
    if (parsed.pathname.startsWith("/shorts/")) {
      return parsed.pathname.replace("/shorts/", "");
    }
    return parsed.searchParams.get("v") ?? "";
  } catch {
    return "";
  }
}

export async function getFeaturedVideos(locale: Locale): Promise<VideoItem[]> {
  const videos = await client.fetch<
    { _id: string; caption: string; thumbnail: Parameters<typeof urlFor>[0] | null; youtubeUrl: string | null }[]
  >(FEATURED_VIDEOS_QUERY, { locale });

  return videos.map((item) => ({
    id: item._id,
    caption: item.caption,
    thumbnailUrl: item.thumbnail ? urlFor(item.thumbnail).width(440).height(780).fit("crop").url() : null,
    videoId: extractYoutubeId(item.youtubeUrl),
  }));
}

const ALL_VIDEOS_QUERY = `*[_type == "video"] | order(publishedAt desc){
  _id,
  "caption": select($locale == "vi" => description, $locale == "zh" => coalesce(descriptionZh, description), coalesce(descriptionEn, description)),
  thumbnail,
  youtubeUrl
}`;

export async function getAllVideos(locale: Locale): Promise<VideoItem[]> {
  const videos = await client.fetch<
    { _id: string; caption: string; thumbnail: Parameters<typeof urlFor>[0] | null; youtubeUrl: string | null }[]
  >(ALL_VIDEOS_QUERY, { locale });

  return videos.map((item) => ({
    id: item._id,
    caption: item.caption,
    thumbnailUrl: item.thumbnail ? urlFor(item.thumbnail).width(440).height(780).fit("crop").url() : null,
    videoId: extractYoutubeId(item.youtubeUrl),
  }));
}
