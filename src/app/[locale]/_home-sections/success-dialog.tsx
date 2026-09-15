"use client";

import { motion } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { CircleCheckIcon } from "@/components/icons/circle-check";

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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
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

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm overflow-visible bg-transparent p-0 backdrop:bg-[rgba(40,20,8,0.45)] backdrop:backdrop-blur-[2px] sm:max-w-md"
    >
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="relative flex flex-col items-center gap-3 rounded-3xl bg-white px-6 pt-8 pb-6 text-center shadow-[0px_20px_48px_0px_rgba(99,43,14,0.22)] sm:gap-4 sm:px-8 sm:pt-10 sm:pb-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-background-alt)] hover:text-[var(--color-accent)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <span className="flex size-20 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)] ring-8 ring-[color-mix(in_srgb,var(--color-success)_6%,transparent)] sm:size-24">
            <CircleCheckIcon size={48} className="size-11 sm:size-12 [&>svg]:size-full" aria-hidden="true" />
          </span>

          <h3 id={titleId} className="text-xl font-semibold text-[var(--color-accent)] sm:text-2xl">
            {title}
          </h3>
          <p id={messageId} className="text-sm leading-relaxed text-[rgba(99,43,14,0.75)] sm:text-base">
            {message}
          </p>

          <button
            ref={primaryButtonRef}
            type="button"
            onClick={onClose}
            className="mt-2 w-full rounded-full border-2 border-transparent bg-[var(--color-accent)] px-6 py-3 text-sm font-bold tracking-[0.16px] text-[var(--color-accent-foreground)] transition-colors hover:border-[var(--color-accent)] hover:bg-transparent hover:text-[var(--color-accent)]"
          >
            {closeLabel}
          </button>
        </motion.div>
      )}
    </dialog>
  );
}
