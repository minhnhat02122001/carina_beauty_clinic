// Business facts shared by the footer, the floating contact buttons and the JSON-LD, so a changed
// number or link can't leave Google's structured data disagreeing with what the page shows.
export const CLINIC_NAME = "Carina Beauty Clinic";
export const PHONE = "+84773993968";
export const EMAIL = "carinabeauty.info@gmail.com";
export const ZALO_URL = "https://zalo.me/141525660384752857";

export const SOCIAL_LINKS = [
  { platform: "facebook", labelKey: "socialFacebook", href: "https://www.facebook.com/carinatherealluxury/" },
  { platform: "instagram", labelKey: "socialInstagram", href: "https://www.instagram.com/carina_therealluxury/" },
  { platform: "tiktok", labelKey: "socialTiktok", href: "https://www.tiktok.com/@phongkhamdalieucarina" },
  { platform: "youtube", labelKey: "socialYoutube", href: "https://www.youtube.com/@CarinaBeautyClinic" },
  { platform: "zalo", labelKey: "socialZalo", href: ZALO_URL },
] as const;
