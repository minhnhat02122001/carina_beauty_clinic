import type { Locale } from "@/i18n/routing";
import type { PostDetail } from "@/sanity/lib/posts";
import { CLINIC_NAME, EMAIL, PHONE, SOCIAL_LINKS } from "@/lib/clinic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const CLINIC_ID = `${SITE}/#clinic`;
const CLINIC_REF = { "@type": "MedicalClinic", "@id": CLINIC_ID, name: CLINIC_NAME, url: SITE };

export function clinicJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...CLINIC_REF,
        logo: `${SITE}/images/logo/logo-icon.png`,
        image: `${SITE}/images/og/og-default.jpg`,
        description,
        telephone: PHONE,
        email: EMAIL,
        // Google penalizes structured data that disagrees with the page: keep in step with Footer.address* in
        // src/messages/vi.json. The address stays Vietnamese in every locale — it's the clinic's real address.
        address: {
          "@type": "PostalAddress",
          streetAddress: "09 Đường B4, Khu Đô Thị Sala",
          addressLocality: "An Khánh",
          addressRegion: "TP. Hồ Chí Minh",
          addressCountry: "VN",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "09:00",
          closes: "21:00",
        },
        medicalSpecialty: "Dermatology",
        sameAs: SOCIAL_LINKS.map((social) => social.href),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: CLINIC_NAME,
        inLanguage: locale,
        publisher: { "@id": CLINIC_ID },
      },
    ],
  };
}

export function articleJsonLd(post: PostDetail, pathname: string, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.imageUrl ? [post.imageUrl] : undefined,
    datePublished: post.publishedAtISO,
    inLanguage: locale,
    mainEntityOfPage: `${SITE}${pathname}`,
    author: CLINIC_REF,
    publisher: CLINIC_REF,
  };
}
