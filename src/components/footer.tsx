import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SocialIcon } from "@/components/social-icon";

const FEATURED_LINKS = [
  { href: "/about", key: "featuredAbout" },
  { href: "/beauty-knowledge", key: "featuredKnowledge" },
  { href: "/promotions", key: "featuredPromotions" },
  { href: "/news-events", key: "featuredNews" },
] as const;

const SUPPORT_LINKS = [
  { href: "/content-policy", key: "supportContent" },
  { href: "/privacy-policy", key: "supportPrivacy" },
  { href: "/media-policy", key: "supportMedia" },
  { href: "/contact", key: "supportContact" },
] as const;

const SOCIAL_LINKS = [
  { platform: "facebook", labelKey: "socialFacebook", href: "https://www.facebook.com/carinatherealluxury/" },
  { platform: "instagram", labelKey: "socialInstagram", href: "https://www.instagram.com/carina_therealluxury/" },
  { platform: "tiktok", labelKey: "socialTiktok", href: "https://www.tiktok.com/@phongkhamdalieucarina" },
  { platform: "youtube", labelKey: "socialYoutube", href: "https://www.youtube.com/@CarinaBeautyClinic" },
  { platform: "zalo", labelKey: "socialZalo", href: "https://zalo.me/141525660384752857" },
] as const;

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return <p className="font-serif text-base font-bold text-white">{children}</p>;
}

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-[var(--color-accent)] text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 md:px-10 md:py-8 lg:px-28 lg:py-12">
        <div className="flex flex-col gap-8 opacity-80 lg:grid lg:grid-cols-[minmax(0,1fr)_fit-content(100%)_fit-content(100%)_minmax(0,1fr)] lg:gap-12">
          {/* Logo + description */}
          <div className="flex flex-col items-center gap-4 text-center lg:items-center">
            <span className="relative aspect-[205/68] h-16 w-auto lg:h-20">
              <Image
                src="/images/footer/logo.png"
                alt="Carina Beauty Clinic"
                fill
                className="object-contain"
                sizes="240px"
              />
            </span>
            <p className="w-full text-left font-serif text-lg font-bold text-white sm:text-xl">
              {t("taglineLine1")} {t("taglineLine2")}
            </p>
            <p className="text-justify text-sm text-white">{t("description")}</p>
          </div>

          {/* Contact info */}
          <div className="flex flex-col items-start gap-2 lg:w-[220px]">
            <ColumnHeading>{t("contactHeading")}</ColumnHeading>
            <div className="text-sm text-white">
              <p className="font-bold">{t("addressLabel")}</p>
              <p>{t("addressLine1")}</p>
              <p>{t("addressLine2")}</p>
            </div>
            <div className="text-sm text-white">
              <p className="font-bold">{t("hoursLabel")}</p>
              <p>{t("hoursValue")}</p>
            </div>
            <div className="text-sm text-white">
              <p className="font-bold">{t("careLabel")}</p>
              <p>{t("hotlineValue")}</p>
              <p>{t("emailValue")}</p>
            </div>
          </div>

          {/* Featured links */}
          <div className="flex flex-col items-start gap-2 lg:w-[180px]">
            <ColumnHeading>{t("featuredHeading")}</ColumnHeading>
            <ul className="flex flex-col gap-2">
              {FEATURED_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white hover:opacity-70">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links + social */}
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <div className="flex flex-col items-start gap-2 self-stretch">
              <ColumnHeading>{t("supportHeading")}</ColumnHeading>
              <ul className="flex flex-col gap-2">
                {SUPPORT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white hover:opacity-70">
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-2 self-stretch">
              <ColumnHeading>{t("connectHeading")}</ColumnHeading>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <SocialIcon
                    key={social.platform}
                    platform={social.platform}
                    href={social.href}
                    label={t(social.labelKey)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-center text-[10px] text-[rgba(255,255,255,0.6)] italic sm:text-xs">{t("disclaimer")}</p>
          <p className="w-full border-t border-[#c6c6c8] pt-2 text-center text-sm font-bold text-[rgba(255,255,255,0.6)]">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
