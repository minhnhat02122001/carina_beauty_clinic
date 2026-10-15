import type { Metadata, Viewport } from "next";
import { Montserrat, Merriweather, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { baseOpenGraph } from "@/lib/metadata";
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
  // Only the stat numbers ("10+", "10.000+") use it, all font-semibold — no Vietnamese glyphs, one weight.
  subsets: ["latin"],
  weight: ["600"],
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

// Any other first segment (e.g. /robots.txt, /.env — dotted paths skip the proxy) 404s before rendering,
// instead of rendering the static layout with a bogus locale and failing as a 500.
export const dynamicParams = false;

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
    openGraph: baseOpenGraph(locale as Locale),
    twitter: { card: "summary_large_image" },
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
      <head>
        {gtmId && (
          // A plain <script>, not next/script or @next/third-parties (built on it): every next/script strategy
          // ships the snippet inside Next's own loader payload, so Search Console's GTM verification can't find
          // it in <head> and fails with "snippet in the wrong location".
          // eslint-disable-next-line @next/next/next-script-for-ga
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
      </head>
      <body className="flex min-h-full flex-col">
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              title="Google Tag Manager"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
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
