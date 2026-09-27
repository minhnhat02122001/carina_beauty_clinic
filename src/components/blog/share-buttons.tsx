"use client";

import { useState, useSyncExternalStore } from "react";

const iconClasses = "size-6";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClasses} aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClasses} aria-hidden="true">
      <path d="M18.9 2H22l-6.8 7.7L23 22h-6.4l-5-6.6L5.8 22H2.7l7.2-8.2L1.6 2H8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.4 3.8H5.6L17.8 20Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClasses} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClasses} aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1 1" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1-1" />
    </svg>
  );
}

const buttonClasses =
  "flex size-9 shrink-0 items-center justify-center text-white transition-transform hover:scale-110";

// useSyncExternalStore only re-renders when `subscribe`'s callback fires, and
// the real URL is only known after mount (SSR/first paint must render "" to
// avoid a hydration mismatch) — this callback fires once, right after mount,
// to trigger that one re-render with the real `window.location.href`.
function subscribeOnMount(callback: () => void) {
  const id = setTimeout(callback, 0);
  return () => clearTimeout(id);
}

function getUrlSnapshot() {
  return window.location.href;
}

function getServerUrlSnapshot() {
  return "";
}

export function ShareButtons({ title, label, copyLabel, copiedLabel }: { title: string; label: string; copyLabel: string; copiedLabel: string }) {
  // Server and the first client render both see "" (avoids a hydration
  // mismatch); useSyncExternalStore re-reads the real URL right after mount.
  const url = useSyncExternalStore(subscribeOnMount, getUrlSnapshot, getServerUrlSnapshot);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <p className="-mx-4 bg-[var(--color-background-alt)] px-4 py-2 text-center text-sm font-semibold text-[var(--color-accent)] sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-left">
        {label}
      </p>
      <div className="flex items-center justify-start gap-2 self-center rounded-lg bg-[var(--color-gold)] px-1 py-0.5 sm:ml-auto sm:self-auto">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          aria-label="Facebook"
          className={buttonClasses}
        >
          <FacebookIcon />
        </a>
        <a
          href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          aria-label="X"
          className={buttonClasses}
        >
          <XIcon />
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
          aria-label="Email"
          className={buttonClasses}
        >
          <EmailIcon />
        </a>
        <button type="button" onClick={handleCopy} aria-label={copyLabel} className={buttonClasses}>
          <LinkIcon />
        </button>
        {copied && <span className="hidden text-xs text-[var(--color-muted)] sm:inline">{copiedLabel}</span>}
      </div>
      {copied && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white shadow-lg sm:hidden"
        >
          {copiedLabel}
        </div>
      )}
    </div>
  );
}
