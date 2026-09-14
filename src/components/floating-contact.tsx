"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CalendarCheckIcon } from "@/components/icons/calendar-check";
import { PhoneCallIcon } from "@/components/icons/phone-call";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { scrollToRegistrationForm } from "@/lib/scroll-to-registration-form";

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

function WigglingLogo({ src, delay }: { src: string; delay: number }) {
  return (
    <motion.span
      className="block size-8 sm:size-11 lg:size-[48px]"
      animate={{ rotate: [0, 15, -10, 8, 0], scale: [1, 1.08, 1.12, 1.08, 1] }}
      transition={{ duration: 0.9, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.8, delay }}
    >
      <Image src={src} alt="" width={48} height={48} className="size-full" />
    </motion.span>
  );
}

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
        onClick={scrollToRegistrationForm}
      >
        <span aria-hidden className={glowLayerClasses} />
        <span className={glowInnerClasses}>
          <CalendarCheckIcon className="size-4 text-[var(--color-accent)] sm:size-6 lg:size-7 [&>svg]:size-full" />
        </span>
      </Link>
      <a href={PHONE_TEL} aria-label={t("callLabel")} className={glowButtonClasses}>
        <span aria-hidden className={glowLayerClasses} />
        <span className={glowInnerClasses}>
          <PhoneCallIcon className="size-4 text-[var(--color-accent)] sm:size-6 lg:size-7 [&>svg]:size-full" />
        </span>
      </a>
      <a href={ZALO_URL} aria-label={t("zaloLabel")} className={iconOnlyClasses}>
        <WigglingLogo src="/images/footer/social-zalo.svg" delay={0.3} />
      </a>
      <a href={MESSENGER_URL} aria-label={t("messengerLabel")} className={iconOnlyClasses}>
        <WigglingLogo src="/images/floating-contact/icon-messenger.svg" delay={0.6} />
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
