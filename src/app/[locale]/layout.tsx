import type { Metadata, Viewport } from "next";
import { Montserrat, Merriweather, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FloatingContact } from "@/components/floating-contact";
import { getNavigationSettings } from "@/sanity/lib/nav";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

// Figma's "1FTV VIP Fairyland" — a proprietary Vietnamese script font,
// self-hosted from public/fonts since it isn't on Google Fonts.
const fairyland = localFont({
  src: "../../../public/fonts/1FTV-VIP-Fairyland.woff2",
  variable: "--font-script",
  display: "swap",
});

// One GTM container stands in for every marketing tag: the Facebook Pixel and
// anything after it is added from the GTM UI, so a new tag needs no redeploy.
// Unset (dev, previews) renders nothing rather than loading an empty container.
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Sanity-backed pages are statically generated at build time; without this,
// production only picks up new/edited content on the next deploy. Applies to
// every page under this layout unless a route overrides it.
export const revalidate = 60;

// With no theme-color, a mobile browser derives its own tint for the chrome
// around the page. One value, not a light/dark pair: the site is light-only on
// purpose (globals.css re-asserts the light palette under prefers-color-scheme:
// dark), so a dark variant would tint the chrome for a page that never darkens.
// Must stay equal to --background there — a meta tag cannot read a CSS variable.
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const navigationSettings = await getNavigationSettings(locale);

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${merriweather.variable} ${fairyland.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {gtmId && (
          <>
            <Script
              id="gtm"
              strategy="afterInteractive"
            >{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}</Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                title="Google Tag Manager"
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        <NextIntlClientProvider>
          <Nav navigationSettings={navigationSettings} />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingContact />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
