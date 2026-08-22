"use client";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link } from "@/i18n/navigation";
import {
  groupTreatmentsBySubgroup,
  treatmentHref,
  type TreatmentCategory,
  type TreatmentsByCategory,
  type TreatmentSummary,
} from "@/sanity/lib/service";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/about", key: "about", category: null },
  { href: "/services/exclusive", key: "exclusive", category: "exclusive" },
  { href: "/services/lifting-rejuvenation", key: "liftingRejuvenation", category: "lifting-rejuvenation" },
  { href: "/services/skin-therapy", key: "skinTherapy", category: "skin-therapy" },
  { href: "/services/rejuvenation-injections", key: "rejuvenationInjections", category: "rejuvenation-injections" },
  { href: "/services/body-care", key: "bodyCare", category: "body-care" },
  { href: "/services/skin-care", key: "skinCare", category: "skin-care" },
] as const satisfies { href: string; key: string; category: TreatmentCategory | null }[];

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 8" fill="none" className={className} aria-hidden="true">
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConsultButton({ label, className }: { label: string; className?: string }) {
  return (
    <Link
      href={{ pathname: "/", hash: "registration-form" }}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-bold text-[var(--color-accent-foreground)] hover:opacity-90 2xl:px-6 2xl:py-2.5 ${className ?? ""}`}
    >
      <span className="relative size-4 shrink-0">
        <Image src="/images/logo/icon-consult.svg" alt="" fill sizes="16px" />
      </span>
      {label}
    </Link>
  );
}

function MenuIcon() {
  return (
    <span className="flex size-7 flex-col items-center justify-center gap-[5px] sm:size-8" aria-hidden="true">
      <span className="relative h-[2px] w-6 sm:w-7">
        <Image src="/images/logo/icon-menu-bar.svg" alt="" fill sizes="28px" />
      </span>
      <span className="relative h-[2px] w-6 sm:w-7">
        <Image src="/images/logo/icon-menu-bar.svg" alt="" fill sizes="28px" />
      </span>
      <span className="relative h-[2px] w-6 sm:w-7">
        <Image src="/images/logo/icon-menu-bar.svg" alt="" fill sizes="28px" />
      </span>
    </span>
  );
}

function DesktopServiceDropdown({ category, items }: { category: TreatmentCategory; items: TreatmentSummary[] }) {
  if (items.length === 0) return null;

  return (
    <div className="absolute top-full left-0 z-20 hidden w-72 flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-submenu-background)] p-3 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.12)] group-hover:flex">
      {groupTreatmentsBySubgroup(items).map((group) => (
        <div key={group.subgroup ?? "_"} className="flex flex-col gap-0.5">
          {group.subgroup && (
            <p className="rounded-lg px-2 py-1.5 text-sm font-bold tracking-wide text-[var(--color-muted)]">
              {group.subgroup}
            </p>
          )}
          {group.items.map((item) => (
            <Link
              key={item.id}
              href={treatmentHref(category, item.slug)}
              className="rounded-lg py-1.5 pr-2 pl-4 text-xs text-[var(--foreground)] hover:opacity-70"
            >
              {item.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

function MobileServiceAccordion({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex items-center justify-between rounded-lg px-2 py-1"
    >
      <ChevronIcon
        className={`size-3 shrink-0 text-[var(--foreground)] transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}

export function Nav({ treatmentsByCategory }: { treatmentsByCategory: TreatmentsByCategory }) {
  const t = useTranslations("Nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState<TreatmentCategory | null>(null);
  const [openMobileSubgroups, setOpenMobileSubgroups] = useState<Set<string>>(new Set());
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);

  const toggleMobileSubgroup = (key: string) => {
    setOpenMobileSubgroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--background)] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] lg:relative lg:shadow-none">
        {/* Desktop */}
        <div className="mx-auto hidden max-w-[1440px] items-center justify-between gap-4 px-4 py-4 lg:flex 2xl:gap-6 2xl:px-6">
          <Link href="/" aria-label={t("home")} className="relative aspect-[205/68] h-14 w-auto shrink-0 xl:h-[68px]">
            <Image
              src="/images/logo/logo-full.png"
              alt="Carina Beauty Clinic"
              fill
              className="object-contain"
              sizes="(min-width: 1280px) 205px, 170px"
              priority
            />
          </Link>
          <nav className="flex items-center gap-2 2xl:gap-4" aria-label={t("menu")}>
            {NAV_LINKS.map((link) => (
              <div
                key={link.href}
                className="group relative"
                onMouseEnter={link.category ? () => setIsDropdownHovered(true) : undefined}
                onMouseLeave={link.category ? () => setIsDropdownHovered(false) : undefined}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 text-base font-bold whitespace-nowrap text-[var(--foreground)] opacity-80 hover:opacity-60"
                >
                  {t(link.key)}
                  {link.category && (
                    <ChevronIcon className="size-2.5 shrink-0 transition-transform group-hover:rotate-180" />
                  )}
                </Link>
                {link.category && (
                  <DesktopServiceDropdown category={link.category} items={treatmentsByCategory[link.category] ?? []} />
                )}
              </div>
            ))}
            <ConsultButton label={t("consult")} />
          </nav>
          <div className="flex items-center border-[var(--color-border)] pl-4 2xl:pl-6">
            <LocaleSwitcher />
          </div>
        </div>

        {/* Mobile */}
        <div className="relative flex items-center justify-between px-4 py-3 lg:hidden">
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
            className="absolute top-1/2 left-1/2 aspect-[205/68] h-10 w-auto -translate-x-1/2 -translate-y-1/2 sm:h-12"
          >
            <Image
              src="/images/logo/logo-full.png"
              alt="Carina Beauty Clinic"
              fill
              className="object-contain"
              sizes="(min-width: 640px) 145px, 121px"
              priority
            />
          </Link>
          <LocaleSwitcher />
        </div>

        {menuOpen && (
          <nav
            aria-label={t("menu")}
            className="flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto overscroll-contain px-4 py-4 lg:hidden"
          >
            {NAV_LINKS.map((link) => {
              const items = link.category ? (treatmentsByCategory[link.category] ?? []) : [];
              const hasSubmenu = link.category && items.length > 0;
              const isOpen = openMobileCategory === link.category;

              return (
                <div key={link.href} className="flex flex-col">
                  <div className="flex items-center justify-between rounded-lg hover:bg-black/5">
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 px-2 py-2.5 text-base font-bold text-[var(--foreground)]"
                    >
                      {t(link.key)}
                    </Link>
                    {hasSubmenu && (
                      <MobileServiceAccordion
                        isOpen={isOpen}
                        onToggle={() => setOpenMobileCategory(isOpen ? null : link.category!)}
                      />
                    )}
                  </div>
                  {hasSubmenu && isOpen && (
                    <div className="flex flex-col gap-1 bg-[var(--color-submenu-background)] py-2 pl-4">
                      {groupTreatmentsBySubgroup(items).map((group) => {
                        if (!group.subgroup) {
                          return group.items.map((item) => (
                            <Link
                              key={item.id}
                              href={treatmentHref(link.category!, item.slug)}
                              onClick={() => setMenuOpen(false)}
                              className="rounded-lg px-2 py-2 text-xs text-[var(--foreground)] hover:opacity-70"
                            >
                              {item.name}
                            </Link>
                          ));
                        }

                        const subgroupKey = `${link.category}:${group.subgroup}`;
                        const isSubgroupOpen = openMobileSubgroups.has(subgroupKey);

                        return (
                          <div key={group.subgroup} className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => toggleMobileSubgroup(subgroupKey)}
                              aria-expanded={isSubgroupOpen}
                              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-bold tracking-wide text-[var(--color-muted)]"
                            >
                              {group.subgroup}
                              <ChevronIcon
                                className={`size-2.5 shrink-0 text-[var(--color-muted)] transition-transform ${
                                  isSubgroupOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isSubgroupOpen && (
                              <div className="flex flex-col gap-0.5 py-1 pl-4">
                                {group.items.map((item) => (
                                  <Link
                                    key={item.id}
                                    href={treatmentHref(link.category!, item.slug)}
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-lg px-2 py-2 text-xs text-[var(--foreground)] hover:opacity-70"
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}
      </header>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-40 hidden bg-black/50 transition-opacity duration-200 lg:block ${
          isDropdownHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
