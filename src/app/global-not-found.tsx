import type { Metadata } from "next";
// Not @/i18n/navigation: this renders outside the locale layout, and the proxy sends "/" to the default locale.
import Link from "next/link";
import { routing } from "@/i18n/routing";
import messages from "@/messages/vi.json";
import "./[locale]/globals.css";

// Rendered outside every layout (the root layout is the dynamic [locale] segment), so there is no request
// locale here — the default locale's copy is used.
const t = messages.NotFound;

export const metadata: Metadata = { title: t.title, robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--background)] px-4 text-center text-[var(--foreground)] sm:gap-5">
        <p className="text-5xl font-semibold text-[var(--color-accent)] sm:text-6xl">404</p>
        <h1 className="text-xl font-semibold sm:text-2xl">{t.title}</h1>
        <p className="max-w-md text-sm sm:text-base">{t.body}</p>
        <Link
          href="/"
          className="rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--background)] sm:text-base"
        >
          {t.home}
        </Link>
      </body>
    </html>
  );
}
