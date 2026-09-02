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

function ZaloIcon() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" className={iconClasses} aria-hidden="true">
      <g transform="scale(5.12,5.12)">
        <path d="M9,4c-2.74952,0 -5,2.25048 -5,5v32c0,2.74952 2.25048,5 5,5h32c2.74952,0 5,-2.25048 5,-5v-32c0,-2.74952 -2.25048,-5 -5,-5zM9,6h6.58008c-3.57109,3.71569 -5.58008,8.51808 -5.58008,13.5c0,5.16 2.11016,10.09984 5.91016,13.83984c0.12,0.21 0.21977,1.23969 -0.24023,2.42969c-0.29,0.75 -0.87023,1.72961 -1.99023,2.09961c-0.43,0.14 -0.70969,0.56172 -0.67969,1.01172c0.03,0.45 0.36078,0.82992 0.80078,0.91992c2.87,0.57 4.72852,-0.2907 6.22852,-0.9707c1.35,-0.62 2.24133,-1.04047 3.61133,-0.48047c2.8,1.09 5.77938,1.65039 8.85938,1.65039c4.09369,0 8.03146,-0.99927 11.5,-2.88672v3.88672c0,1.66848 -1.33152,3 -3,3h-32c-1.66848,0 -3,-1.33152 -3,-3v-32c0,-1.66848 1.33152,-3 3,-3zM33,15c0.55,0 1,0.45 1,1v9c0,0.55 -0.45,1 -1,1c-0.55,0 -1,-0.45 -1,-1v-9c0,-0.55 0.45,-1 1,-1zM18,16h5c0.36,0 0.70086,0.19953 0.88086,0.51953c0.17,0.31 0.15875,0.69977 -0.03125,1.00977l-4.04883,6.4707h3.19922c0.55,0 1,0.45 1,1c0,0.55 -0.45,1 -1,1h-5c-0.36,0 -0.70086,-0.19953 -0.88086,-0.51953c-0.17,-0.31 -0.15875,-0.69977 0.03125,-1.00977l4.04883,-6.4707h-3.19922c-0.55,0 -1,-0.45 -1,-1c0,-0.55 0.45,-1 1,-1zM27.5,19c0.61,0 1.17945,0.16922 1.68945,0.44922c0.18,-0.26 0.46055,-0.44922 0.81055,-0.44922c0.55,0 1,0.45 1,1v5c0,0.55 -0.45,1 -1,1c-0.35,0 -0.63055,-0.18922 -0.81055,-0.44922c-0.51,0.28 -1.07945,0.44922 -1.68945,0.44922c-1.93,0 -3.5,-1.57 -3.5,-3.5c0,-1.93 1.57,-3.5 3.5,-3.5zM38.5,19c1.93,0 3.5,1.57 3.5,3.5c0,1.93 -1.57,3.5 -3.5,3.5c-1.93,0 -3.5,-1.57 -3.5,-3.5c0,-1.93 1.57,-3.5 3.5,-3.5zM27.5,21c-0.10375,0 -0.20498,0.01131 -0.30273,0.03125c-0.19551,0.03988 -0.37754,0.11691 -0.53711,0.22461c-0.15957,0.1077 -0.2966,0.24473 -0.4043,0.4043c-0.10769,0.15957 -0.18473,0.3416 -0.22461,0.53711c-0.01994,0.09775 -0.03125,0.19898 -0.03125,0.30273c0,0.10375 0.01131,0.20498 0.03125,0.30273c0.01994,0.09775 0.04805,0.19149 0.08594,0.28125c0.03789,0.08977 0.08482,0.17607 0.13867,0.25586c0.05385,0.07979 0.11578,0.15289 0.18359,0.2207c0.06781,0.06781 0.14092,0.12975 0.2207,0.18359c0.15957,0.10769 0.3416,0.18473 0.53711,0.22461c0.09775,0.01994 0.19898,0.03125 0.30273,0.03125c0.10375,0 0.20498,-0.01131 0.30273,-0.03125c0.68428,-0.13959 1.19727,-0.7425 1.19727,-1.46875c0,-0.83 -0.67,-1.5 -1.5,-1.5zM38.5,21c-0.10375,0 -0.20498,0.01131 -0.30273,0.03125c-0.09775,0.01994 -0.19149,0.04805 -0.28125,0.08594c-0.08977,0.03789 -0.17607,0.08482 -0.25586,0.13867c-0.07979,0.05385 -0.15289,0.11578 -0.2207,0.18359c-0.13562,0.13563 -0.24648,0.29703 -0.32227,0.47656c-0.03789,0.08976 -0.066,0.1835 -0.08594,0.28125c-0.01994,0.09775 -0.03125,0.19898 -0.03125,0.30273c0,0.10375 0.01131,0.20498 0.03125,0.30273c0.01994,0.09775 0.04805,0.19149 0.08594,0.28125c0.03789,0.08977 0.08482,0.17607 0.13867,0.25586c0.05385,0.07979 0.11578,0.15289 0.18359,0.2207c0.06781,0.06781 0.14092,0.12975 0.2207,0.18359c0.07979,0.05385 0.16609,0.10078 0.25586,0.13867c0.08976,0.03789 0.1835,0.066 0.28125,0.08594c0.09775,0.01994 0.19898,0.03125 0.30273,0.03125c0.10375,0 0.20498,-0.01131 0.30273,-0.03125c0.68428,-0.13959 1.19727,-0.7425 1.19727,-1.46875c0,-0.83 -0.67,-1.5 -1.5,-1.5z" />
      </g>
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

  // On mobile, letting the OS handle a plain click on a facebook.com/zalo.me
  // link hands it to the installed app via universal links — but the app
  // doesn't know how to open these share URLs as a compose screen, so it
  // just opens to the feed/home and the share is lost. Opening it as a
  // named popup instead keeps it in the browser (or an in-app browser
  // tab), where the share page reliably shows its dialog with the link
  // attached.
  function handleSocialShare(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.open(event.currentTarget.href, "social-share", "width=600,height=520,noopener,noreferrer");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <p className="-mx-4 bg-[var(--color-background-alt)] px-4 py-2 text-center text-sm font-semibold text-[var(--color-accent)] sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-left">
        {label}
      </p>
      <div className="flex items-center justify-start gap-2 self-center rounded-lg bg-[var(--color-gold)] px-1 py-0.5 sm:ml-auto sm:self-auto">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          onClick={handleSocialShare}
          aria-label="Facebook"
          className={buttonClasses}
        >
          <FacebookIcon />
        </a>
        <a
          href={`https://sp.zalo.me/share?u=${encodeURIComponent(url)}`}
          onClick={handleSocialShare}
          aria-label="Zalo"
          className={buttonClasses}
        >
          <ZaloIcon />
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
