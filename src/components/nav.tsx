"use client";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link } from "@/i18n/navigation";
import type { NavigationSettings } from "@/sanity/lib/nav";
import { treatmentHref, type TreatmentCategory, type TreatmentSubgroupGroup } from "@/sanity/lib/service";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/about", key: "about", category: null, settingsKey: null },
  { href: "/services/exclusive", key: "exclusive", category: "exclusive", settingsKey: "exclusive" },
  {
    href: "/services/lifting-rejuvenation",
    key: "liftingRejuvenation",
    category: "lifting-rejuvenation",
    settingsKey: "liftingRejuvenation",
  },
  {
    href: "/services/skin-therapy",
    key: "skinTherapy",
    category: "skin-therapy",
    settingsKey: "skinTherapy",
  },
  {
    href: "/services/rejuvenation-injections",
    key: "rejuvenationInjections",
    category: "rejuvenation-injections",
    settingsKey: "rejuvenationInjections",
  },
  { href: "/services/body-care", key: "bodyCare", category: "body-care", settingsKey: "bodyCare" },
  { href: "/services/skin-care", key: "skinCare", category: "skin-care", settingsKey: "skinCare" },
] as const satisfies {
  href: string;
  key: string;
  category: TreatmentCategory | null;
  settingsKey: keyof NavigationSettings | null;
}[];

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

function DesktopServiceDropdown({
  category,
  groups,
  isOpen,
}: {
  category: TreatmentCategory;
  groups: TreatmentSubgroupGroup[];
  isOpen: boolean;
}) {
  const [activeSubgroup, setActiveSubgroup] = useState<string | null>(null);
  const [alignRight, setAlignRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Panels size to their content (w-max), so whether they'd overflow the
    // viewport can only be known after render — measure and flip the anchor
    // side rather than guessing from the link's position alone.
    const checkOverflow = () => {
      const rect = el.getBoundingClientRect();
      setAlignRight(rect.right > window.innerWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [activeSubgroup]);

  if (groups.every((group) => group.items.length === 0)) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute top-full z-20 ${isOpen ? "visible" : "invisible"} ${alignRight ? "right-0" : "left-0"}`}
    >
      <div className="flex w-max max-w-80 flex-col gap-0.5 rounded-2xl bg-[var(--color-submenu-background)] p-3 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.12)]">
        {groups.map((group) =>
          !group.subgroup ? (
            group.items.map((item) => (
              <Link
                key={item.id}
                href={treatmentHref(category, item.slug)}
                className="rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
              >
                {item.name}
              </Link>
            ))
          ) : (
            <div key={group.subgroup} className="relative">
              <button
                type="button"
                onMouseEnter={() => setActiveSubgroup(group.subgroup)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-bold tracking-wide transition-colors ${
                  activeSubgroup === group.subgroup
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                {group.subgroup}
                <ChevronIcon className="size-2.5 shrink-0 -rotate-90" />
              </button>

              {activeSubgroup === group.subgroup && (
                <div
                  className={`absolute top-0 flex w-max max-w-80 flex-col gap-0.5 rounded-2xl bg-[var(--color-submenu-background)] p-3 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.12)] ${
                    alignRight ? "right-full mr-4" : "left-full ml-4"
                  }`}
                >
                  {group.items.map((item) => (
                    <Link
                      key={item.id}
                      href={treatmentHref(category, item.slug)}
                      className="rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ),
        )}
      </div>
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

// How long a hovered dropdown/flyout stays open after the pointer leaves —
// long enough to cover a normal mouse path across the visual gap between the
// category panel and its subgroup flyout without feeling laggy on close.
const DROPDOWN_CLOSE_DELAY_MS = 250;

export function Nav({ navigationSettings }: { navigationSettings: NavigationSettings }) {
  const t = useTranslations("Nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState<TreatmentCategory | null>(null);
  const [openMobileSubgroups, setOpenMobileSubgroups] = useState<Set<string>>(new Set());
  const [openDesktopCategory, setOpenDesktopCategory] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleNavLinks = NAV_LINKS.filter((link) => !link.settingsKey || navigationSettings[link.settingsKey].show);

  const cancelDesktopClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openDesktopDropdown = (href: string) => {
    cancelDesktopClose();
    setOpenDesktopCategory(href);
  };

  // Delay the close instead of clearing immediately: the pointer briefly
  // crosses unpainted space when moving from the category panel to its
  // flyout (or back), which would otherwise fire this leave and slam the
  // whole dropdown shut before the pointer arrives.
  const scheduleDesktopClose = (href: string) => {
    cancelDesktopClose();
    closeTimerRef.current = setTimeout(() => {
      setOpenDesktopCategory((current) => (current === href ? null : current));
    }, DROPDOWN_CLOSE_DELAY_MS);
  };

  useEffect(() => cancelDesktopClose, []);

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
      <header className="sticky top-0 z-50 bg-[var(--background)] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
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
            {visibleNavLinks.map((link) => {
              const isOpen = openDesktopCategory === link.href;
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={link.category ? () => openDesktopDropdown(link.href) : undefined}
                  onMouseLeave={link.category ? () => scheduleDesktopClose(link.href) : undefined}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-base font-bold whitespace-nowrap text-[var(--foreground)] opacity-80 hover:opacity-60"
                  >
                    {t(link.key)}
                    {link.category && (
                      <ChevronIcon
                        className={`size-2.5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </Link>
                  {link.category && (
                    // Remount on each open so a stale flyout from the previous
                    // hover session never flashes before the user re-hovers it.
                    <DesktopServiceDropdown
                      key={`${link.href}-${isOpen}`}
                      category={link.category}
                      groups={navigationSettings[link.settingsKey!].subgroups}
                      isOpen={isOpen}
                    />
                  )}
                </div>
              );
            })}
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
            {visibleNavLinks.map((link) => {
              const groups = link.settingsKey ? navigationSettings[link.settingsKey].subgroups : [];
              const hasSubmenu = link.category && groups.some((group) => group.items.length > 0);
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
                      {groups.map((group) => {
                        if (!group.subgroup) {
                          return group.items.map((item) => (
                            <Link
                              key={item.id}
                              href={treatmentHref(link.category!, item.slug)}
                              onClick={() => setMenuOpen(false)}
                              className="rounded-lg px-2 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
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
                                    className="rounded-lg px-2 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
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
          openDesktopCategory ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
