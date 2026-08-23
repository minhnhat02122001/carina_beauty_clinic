"use client";

import { useState, useSyncExternalStore } from "react";

const iconClasses = "size-4";

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
      <path d="M18.244 2H21.6l-7.33 8.38L22.9 22h-6.78l-5.31-6.94L4.7 22H1.34l7.84-8.96L1.1 2h6.95l4.8 6.35Zm-1.19 18h1.86L7.03 3.9H5.03Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClasses} aria-hidden="true">
      <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.5 8.5h3.4V21H3.5V8.5Zm6.2 0h3.26v1.71h.05c.45-.86 1.56-1.77 3.22-1.77 3.44 0 4.07 2.27 4.07 5.21V21h-3.4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V21H9.7V8.5Z" />
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

function subscribeNoop() {
  return () => {};
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
  const url = useSyncExternalStore(subscribeNoop, getUrlSnapshot, getServerUrlSnapshot);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm font-semibold text-[var(--color-accent)]">{label}</p>
      <div className="ml-auto flex items-center justify-start gap-2 rounded-lg bg-[var(--color-gold)] px-1 py-0.5">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className={buttonClasses}
        >
          <FacebookIcon />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          className={buttonClasses}
        >
          <XIcon />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={buttonClasses}
        >
          <LinkedInIcon />
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
        {copied && <span className="text-xs text-[var(--color-muted)]">{copiedLabel}</span>}
      </div>
    </div>
  );
}
