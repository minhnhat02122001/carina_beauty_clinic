"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

const ZALO_URL = "https://zalo.me/141525660384752857";
const MESSENGER_URL = "https://m.me/carinatherealluxury";
const PHONE_TEL = "tel:+84773993968";
const SCROLL_TOP_THRESHOLD_PX = 400;

const iconOnlyClasses =
  "flex size-8 shrink-0 items-center justify-center transition-transform hover:scale-105 sm:size-11 lg:size-[48px]";

const glowButtonClasses =
  "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.12)] transition-transform hover:scale-105 sm:size-11 lg:size-[48px]";

const glowLayerClasses =
  "pointer-events-none absolute inset-[-40%] animate-spin bg-[conic-gradient(from_0deg,var(--color-gold),var(--color-accent-foreground),var(--color-accent),var(--color-accent-foreground),var(--color-gold))] [animation-duration:4s] motion-reduce:animate-none";

const glowInnerClasses =
  "absolute inset-[3px] flex items-center justify-center rounded-[9px] bg-white";

function ScrollTopIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 sm:size-6 lg:size-7"
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

export function FloatingContact() {
  const t = useTranslations("FloatingContact");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShowScrollTop(window.scrollY > SCROLL_TOP_THRESHOLD_PX);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="fixed right-2 bottom-3 z-40 flex flex-col items-center gap-2 sm:right-4 sm:bottom-6 sm:gap-3 lg:right-6 lg:gap-4">
      <Link
        href={{ pathname: "/", hash: "registration-form" }}
        aria-label={t("calendarLabel")}
        className={glowButtonClasses}
      >
        <span aria-hidden className={glowLayerClasses} />
        <span className={glowInnerClasses}>
          <Image
            src="/images/floating-contact/icon-calendar.svg"
            alt=""
            width={28}
            height={28}
            className="size-4 sm:size-6 lg:size-7"
          />
        </span>
      </Link>
      <a href={PHONE_TEL} aria-label={t("callLabel")} className={glowButtonClasses}>
        <span aria-hidden className={glowLayerClasses} />
        <span className={glowInnerClasses}>
          <Image
            src="/images/floating-contact/icon-call.svg"
            alt=""
            width={28}
            height={28}
            className="size-4 sm:size-6 lg:size-7"
          />
        </span>
      </a>
      <a href={ZALO_URL} aria-label={t("zaloLabel")} className={iconOnlyClasses}>
        <Image
          src="/images/footer/social-zalo.svg"
          alt=""
          width={48}
          height={48}
          className="size-8 sm:size-11 lg:size-[48px]"
        />
      </a>
      <a href={MESSENGER_URL} aria-label={t("messengerLabel")} className={iconOnlyClasses}>
        <Image
          src="/images/floating-contact/icon-messenger.svg"
          alt=""
          width={48}
          height={48}
          className="size-8 sm:size-11 lg:size-[48px]"
        />
      </a>
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={t("scrollToTopLabel")}
          className={glowButtonClasses}
        >
          <span aria-hidden className={glowLayerClasses} />
          <span className={glowInnerClasses}>
            <ScrollTopIcon />
          </span>
        </button>
      )}
    </div>
  );
}
