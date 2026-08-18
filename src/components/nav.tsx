"use client";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/about", key: "about" },
  { href: "/services/exclusive", key: "exclusive" },
  { href: "/services/lifting-rejuvenation", key: "liftingRejuvenation" },
  { href: "/services/skin-therapy", key: "skinTherapy" },
  { href: "/services/rejuvenation-injections", key: "rejuvenationInjections" },
  { href: "/services/body-care", key: "bodyCare" },
  { href: "/services/skin-care", key: "skinCare" },
] as const;

function ConsultButton({ label, className }: { label: string; className?: string }) {
  return (
    <Link
      href={{ pathname: "/", hash: "registration-form" }}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2 text-xs font-bold text-[var(--color-accent-foreground)] hover:opacity-90 lg:px-6 lg:py-2.5 lg:text-sm ${className ?? ""}`}
    >
      <span className="relative size-4 shrink-0 lg:size-[16px]">
        <Image src="/images/logo/icon-consult.svg" alt="" fill sizes="16px" />
      </span>
      {label}
    </Link>
  );
}

function MenuIcon() {
  return (
    <span className="flex size-6 flex-col items-center justify-center gap-[5px] sm:size-7" aria-hidden="true">
      <span className="relative h-[2px] w-5 sm:w-6">
        <Image src="/images/logo/icon-menu-bar.svg" alt="" fill sizes="24px" />
      </span>
      <span className="relative h-[2px] w-5 sm:w-6">
        <Image src="/images/logo/icon-menu-bar.svg" alt="" fill sizes="24px" />
      </span>
      <span className="relative h-[2px] w-5 sm:w-6">
        <Image src="/images/logo/icon-menu-bar.svg" alt="" fill sizes="24px" />
      </span>
    </span>
  );
}

export function Nav() {
  const t = useTranslations("Nav");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] lg:static lg:shadow-none">
      {/* Desktop */}
      <div className="mx-auto hidden max-w-[1440px] items-center justify-between gap-6 px-6 py-4 lg:flex">
        <Link
          href="/"
          aria-label={t("home")}
          className="relative aspect-[205/68] h-12 w-auto shrink-0 lg:h-14 xl:h-[68px]"
        >
          <Image
            src="/images/logo/logo-full.png"
            alt="Carina Beauty Clinic"
            fill
            className="object-contain"
            sizes="(min-width: 1280px) 205px, 170px"
            priority
          />
        </Link>
        <nav className="flex items-center gap-4" aria-label={t("menu")}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold whitespace-nowrap text-[var(--foreground)] opacity-80 hover:opacity-60 lg:text-[15px] xl:text-base"
            >
              {t(link.key)}
            </Link>
          ))}
          <ConsultButton label={t("consult")} />
        </nav>
        <LocaleSwitcher />
      </div>

      {/* Mobile */}
      <div className="relative flex items-center justify-between px-4 py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={t("menu")}
          aria-expanded={menuOpen}
          className="p-1"
        >
          <MenuIcon />
        </button>
        <Link
          href="/"
          aria-label={t("home")}
          className="absolute top-1/2 left-1/2 aspect-[205/68] h-8 w-auto -translate-x-1/2 -translate-y-1/2 sm:h-10"
        >
          <Image
            src="/images/logo/logo-full.png"
            alt="Carina Beauty Clinic"
            fill
            className="object-contain"
            sizes="(min-width: 640px) 120px, 96px"
            priority
          />
        </Link>
        <LocaleSwitcher />
      </div>

      {menuOpen && (
        <nav aria-label={t("menu")} className="flex flex-col gap-1 px-4 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-bold text-[var(--foreground)] hover:bg-black/5 sm:text-base"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
