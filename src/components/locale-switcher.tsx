"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";

const LOCALE_FLAGS: Record<string, string> = {
  en: "fi-gb",
  vi: "fi-vn",
};

const LOCALE_ARIA_KEYS: Record<string, "switchToEnglish" | "switchToVietnamese"> = {
  en: "switchToEnglish",
  vi: "switchToVietnamese",
};

export function LocaleSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          aria-label={t(LOCALE_ARIA_KEYS[loc])}
          className={`block size-5 shrink-0 overflow-hidden rounded-full sm:size-6 ${loc === locale ? "" : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0"}`}
        >
          <span className={`fi fis ${LOCALE_FLAGS[loc]} block size-full bg-cover bg-center`} />
        </Link>
      ))}
    </div>
  );
}
