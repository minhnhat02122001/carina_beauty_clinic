import { defineRouting } from "next-intl/routing";

// Vietnamese gets SEO-friendly local slugs; en/zh keep the internal
// (English) pathname since no translated slug was requested for them.
export const routing = defineRouting({
  locales: ["vi", "en", "zh"],
  defaultLocale: "vi",
  pathnames: {
    "/": "/",
    "/about": { vi: "/ve-chung-toi" },
    "/about/[slug]": { vi: "/ve-chung-toi/[slug]" },
    "/gallery": { vi: "/thu-vien-anh" },
    "/booking": { vi: "/dat-lich-hen" },
    "/contact": { vi: "/lien-he" },
    "/beauty-knowledge": { vi: "/kien-thuc-lam-dep" },
    "/beauty-knowledge/[slug]": { vi: "/kien-thuc-lam-dep/[slug]" },
    "/promotions": { vi: "/khuyen-mai" },
    "/promotions/[slug]": { vi: "/khuyen-mai/[slug]" },
    "/news-events": { vi: "/tin-tuc-su-kien" },
    "/news-events/[slug]": { vi: "/tin-tuc-su-kien/[slug]" },
    "/videos": { vi: "/video-ngan" },
    "/content-policy": { vi: "/chinh-sach-noi-dung" },
    "/privacy-policy": { vi: "/chinh-sach-bao-mat" },
    "/media-policy": { vi: "/chinh-sach-hinh-anh-video" },
    "/services": { vi: "/dich-vu" },
    "/services/exclusive": { vi: "/doc-quyen" },
    "/services/exclusive/[slug]": { vi: "/doc-quyen/[slug]" },
    "/services/lifting-rejuvenation": { vi: "/nang-co-tre-hoa" },
    "/services/lifting-rejuvenation/[slug]": { vi: "/nang-co-tre-hoa/[slug]" },
    "/services/skin-therapy": { vi: "/dieu-tri-da" },
    "/services/skin-therapy/[slug]": { vi: "/dieu-tri-da/[slug]" },
    "/services/rejuvenation-injections": { vi: "/tiem-tre-hoa" },
    "/services/rejuvenation-injections/[slug]": { vi: "/tiem-tre-hoa/[slug]" },
    "/services/body-care": { vi: "/cham-soc-voc-dang" },
    "/services/body-care/[slug]": { vi: "/cham-soc-voc-dang/[slug]" },
    "/services/skin-care": { vi: "/cham-soc-da" },
    "/services/skin-care/[slug]": { vi: "/cham-soc-da/[slug]" },
  },
});

export type Locale = (typeof routing.locales)[number];
