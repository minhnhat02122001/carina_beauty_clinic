import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

// Portable-text image queries here don't dereference asset->metadata, so the
// only way to know an inline image's real aspect ratio is to parse the
// dimensions Sanity embeds in the asset ref itself
// (image-<hash>-<width>x<height>-<ext>). Without this, a fixed box (e.g.
// 16:9) crops any image shot at another ratio.
function getAspectRatio(value: { asset?: { _ref?: string } }): number | null {
  const match = value.asset?._ref?.match(/-(\d+)x(\d+)-/);
  if (!match) return null;
  return Number(match[1]) / Number(match[2]);
}

export function PortableTextImage({ value }: { value: { asset?: { _ref?: string } } }) {
  if (!value?.asset) return null;
  const aspectRatio = getAspectRatio(value) ?? 16 / 9;

  return (
    <span className="relative my-2 block w-full overflow-hidden rounded-2xl" style={{ aspectRatio }}>
      <Image
        src={urlFor(value).width(1200).url()}
        alt=""
        fill
        className="object-contain"
        sizes="(min-width: 1024px) 768px, 100vw"
      />
    </span>
  );
}
