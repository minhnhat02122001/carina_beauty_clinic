import type { ImageLoaderProps } from "next/image";

export function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  const baseWidth = Number(url.searchParams.get("w")) || width;
  // The width urlFor() asked for is the largest this image was ever meant to be served at.
  const w = Math.min(width, baseWidth);

  // Cropped URLs carry a fixed height; leaving it alone would change the aspect ratio at every width.
  const height = url.searchParams.get("h");
  if (height) url.searchParams.set("h", String(Math.round((Number(height) * w) / baseWidth)));

  url.searchParams.set("w", String(w));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  return url.toString();
}
