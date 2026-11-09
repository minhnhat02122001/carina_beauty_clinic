"use client";

import Image, { type ImageProps } from "next/image";
import { sanityImageLoader } from "@/sanity/lib/image-loader";

export function SanityImage({ alt, ...props }: ImageProps) {
  return <Image alt={alt} loader={sanityImageLoader} {...props} />;
}
