import Image from "next/image";

type Platform = "facebook" | "instagram" | "tiktok" | "youtube" | "zalo";

export function SocialIcon({
  platform,
  label,
  href,
}: {
  platform: Platform;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="relative size-10 shrink-0 sm:size-12"
    >
      {platform === "facebook" && (
        <>
          <span className="absolute inset-x-0 top-0 bottom-[0.37%]">
            <Image src="/images/footer/social-facebook-c.svg" alt="" fill sizes="48px" />
          </span>
          <span className="absolute inset-[18.51%_26.8%_0_27.61%]">
            <Image src="/images/footer/social-facebook-d.svg" alt="" fill sizes="48px" />
          </span>
        </>
      )}
      {platform === "tiktok" && (
        <>
          <span className="absolute inset-[4%_5.61%_0_19.67%]">
            <Image src="/images/footer/social-tiktok-1.svg" alt="" fill sizes="48px" />
          </span>
          <span className="absolute inset-[4%_10.41%_4%_11.04%]">
            <Image src="/images/footer/social-tiktok-2.svg" alt="" fill sizes="48px" />
          </span>
          <span className="absolute inset-[0_10.41%_9.14%_6.25%]">
            <Image src="/images/footer/social-tiktok-3.svg" alt="" fill sizes="48px" />
          </span>
        </>
      )}
      {platform === "youtube" && (
        <>
          <span className="absolute inset-[14.77%_0_14.77%_0]">
            <Image src="/images/footer/social-youtube-1.svg" alt="" fill sizes="48px" />
          </span>
          <span className="absolute inset-[35.13%_33.99%_35.13%_39.87%]">
            <Image src="/images/footer/social-youtube-2.svg" alt="" fill sizes="48px" />
          </span>
        </>
      )}
      {platform === "instagram" && (
        <Image src="/images/footer/social-instagram.svg" alt="" fill sizes="48px" />
      )}
      {platform === "zalo" && (
        <Image src="/images/footer/social-zalo.svg" alt="" fill sizes="48px" />
      )}
    </a>
  );
}
