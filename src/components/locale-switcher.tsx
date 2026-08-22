"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";

const LOCALE_FLAGS: Record<string, string> = {
  en: "fi-gb",
  vi: "fi-vn",
  zh: "fi-cn",
};

const LOCALE_ARIA_KEYS: Record<string, "switchToEnglish" | "switchToVietnamese" | "switchToChinese"> = {
  en: "switchToEnglish",
  vi: "switchToVietnamese",
  zh: "switchToChinese",
};

export function LocaleSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  // Dynamic routes (e.g. /news-events/[slug]) need their params (the actual slug)
  // to compile a localized href — usePathname() alone only returns the pattern.
  const params = useParams();

  return (
    <div className="flex items-center gap-2">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={{ pathname, params } as never}
          locale={loc}
          aria-label={t(LOCALE_ARIA_KEYS[loc])}
          className={`block size-6 shrink-0 overflow-hidden rounded-full ${loc === locale ? "" : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0"}`}
        >
          <span className={`fi fis ${LOCALE_FLAGS[loc]} block size-full bg-cover bg-center`} />
        </Link>
      ))}
    </div>
  );
}
