import { defineRouting } from "next-intl/routing";

// Vietnamese gets SEO-friendly local slugs; en/zh keep the internal
// (English) pathname since no translated slug was requested for them.
export const routing = defineRouting({
  locales: ["vi", "en", "zh"],
  defaultLocale: "vi",
  pathnames: {
    "/": "/",
    "/about": { vi: "/ve-chung-toi" },
    "/gallery": { vi: "/thu-vien-anh" },
    "/booking": { vi: "/dat-lich-hen" },
    "/contact": { vi: "/lien-he" },
    "/beauty-knowledge": { vi: "/kien-thuc-lam-dep" },
    "/beauty-knowledge/[slug]": { vi: "/kien-thuc-lam-dep/[slug]" },
    "/promotions": { vi: "/khuyen-mai" },
    "/promotions/[slug]": { vi: "/khuyen-mai/[slug]" },
    "/news-events": { vi: "/tin-tuc-su-kien" },
    "/news-events/[slug]": { vi: "/tin-tuc-su-kien/[slug]" },
    "/content-policy": { vi: "/chinh-sach-noi-dung" },
    "/privacy-policy": { vi: "/chinh-sach-bao-mat" },
    "/media-policy": { vi: "/chinh-sach-hinh-anh-video" },
    "/services": { vi: "/dich-vu" },
    "/services/exclusive": { vi: "/doc-quyen" },
    "/services/lifting-rejuvenation": { vi: "/nang-co-tre-hoa" },
    "/services/skin-therapy": { vi: "/dieu-tri-da" },
    "/services/rejuvenation-injections": { vi: "/tiem-tre-hoa" },
    "/services/body-care": { vi: "/cham-soc-voc-dang" },
    "/services/skin-care": { vi: "/cham-soc-da" },
  },
});

export type Locale = (typeof routing.locales)[number];
