import { getImageProps } from "next/image";

// Every wide banner on this page ships as two hand-cropped files instead of one:
// a 4:3 phone crop and a 2.25:1 desktop crop. A single upload cannot survive both
// frames — object-cover would slice ~41% off the sides on a phone.
//
// <picture> swaps them natively, the same way the homepage hero does, so only the
// matching file is ever fetched. The dimensions below are the spec the artwork is
// cut to, not any one file's pixels: next/image only needs them for the ratio and
// the srcset widths, so swapping in a final banner needs no change here.
const MOBILE = { width: 1200, height: 900 };
const DESKTOP = { width: 2432, height: 1080 };

export function BannerImage({ desktopSrc, mobileSrc, alt }: { desktopSrc: string; mobileSrc: string; alt: string }) {
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ src: desktopSrc, alt: "", ...DESKTOP });
  const {
    props: { srcSet: mobileSrcSet, ...mobileImgProps },
  } = getImageProps({ src: mobileSrc, alt: "", ...MOBILE });

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:aspect-[1216/540]">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="(min-width: 1216px) 1216px, 100vw" />
        <img
          {...mobileImgProps}
          srcSet={mobileSrcSet}
          sizes="100vw"
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
    </div>
  );
}
