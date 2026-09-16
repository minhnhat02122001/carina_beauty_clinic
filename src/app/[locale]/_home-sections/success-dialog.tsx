"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { CircleCheckIcon } from "@/components/icons/circle-check";

const EXIT_MS = 170;

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 26, delayChildren: 0.12, staggerChildren: 0.06 },
  },
  leaving: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.16, ease: "easeIn" } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  leaving: { opacity: 0, transition: { duration: 0.12 } },
};

const DISC_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 380, damping: 18 } },
  leaving: { opacity: 0, transition: { duration: 0.12 } },
};

export function SuccessDialog({
  open,
  onClose,
  title,
  message,
  closeLabel,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  closeLabel: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const messageId = useId();
  const reduceMotion = useReducedMotion();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setIsLeaving(false);
      dialog.showModal();
      // showModal() focuses the first focusable element (the corner ×); the main action is the better default.
      primaryButtonRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  // Plays the exit animation first, then unmounts. The timeout matches EXIT_MS rather than Motion's
  // completion callback, which doesn't fire reliably for a staggered parent variant.
  function requestClose() {
    if (reduceMotion || isLeaving) {
      onClose();
      return;
    }
    setIsLeaving(true);
    setTimeout(onClose, EXIT_MS);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      className={`m-auto w-[calc(100%-2rem)] max-w-sm overflow-visible bg-transparent p-0 backdrop:bg-[rgba(40,20,8,0.45)] backdrop:backdrop-blur-[2px] sm:max-w-md ${
        isLeaving ? "backdrop:animate-backdrop-out" : "backdrop:animate-backdrop-in"
      }`}
    >
      {open && (
        <motion.div
          variants={CARD_VARIANTS}
          initial={reduceMotion ? "visible" : "hidden"}
          animate={isLeaving ? "leaving" : "visible"}
          className="relative flex flex-col items-center gap-3 rounded-3xl bg-white px-6 pt-8 pb-6 text-center shadow-[0px_20px_48px_0px_rgba(99,43,14,0.22)] sm:gap-4 sm:px-8 sm:pt-10 sm:pb-8"
        >
          <button
            type="button"
            onClick={requestClose}
            aria-label={closeLabel}
            className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-background-alt)] hover:text-[var(--color-accent)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <motion.span
            variants={DISC_VARIANTS}
            className="relative flex size-20 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)] sm:size-24"
          >
            {!reduceMotion && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full ring-2 ring-[color-mix(in_srgb,var(--color-success)_45%,transparent)]"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
                transition={{ duration: 1.3, ease: "easeOut", delay: 0.5, repeat: Infinity, repeatDelay: 1.9 }}
              />
            )}
            <CircleCheckIcon size={48} loop={false} className="size-11 sm:size-12 [&>svg]:size-full" aria-hidden="true" />
          </motion.span>

          <motion.h3
            variants={ITEM_VARIANTS}
            id={titleId}
            className="text-xl font-semibold text-[var(--color-accent)] sm:text-2xl"
          >
            {title}
          </motion.h3>
          <motion.p
            variants={ITEM_VARIANTS}
            id={messageId}
            className="text-sm leading-relaxed text-[rgba(99,43,14,0.75)] sm:text-base"
          >
            {message}
          </motion.p>

          <motion.button
            variants={ITEM_VARIANTS}
            ref={primaryButtonRef}
            type="button"
            onClick={requestClose}
            className="mt-2 w-full rounded-full border-2 border-transparent bg-[var(--color-accent)] px-6 py-3 text-sm font-bold tracking-[0.16px] text-[var(--color-accent-foreground)] transition-colors hover:border-[var(--color-accent)] hover:bg-transparent hover:text-[var(--color-accent)]"
          >
            {closeLabel}
          </motion.button>
        </motion.div>
      )}
    </dialog>
  );
}
