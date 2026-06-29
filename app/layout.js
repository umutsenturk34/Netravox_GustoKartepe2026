import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";

import Footer from "@/components/layout/Footer";
import { DraftModeBanner } from "@/components/layout/DraftModeBanner";
import { DynamicSchemas } from "@/components/layout/DynamicSchemas";
import Navbar from "@/components/layout/Navbar";
import PopupManager from "@/components/ui/PopupManager";
import { RestaurantSchema } from "@/components/seo/RestaurantSchema";
import { getCompany, getFooterNavigation, getNavigation, getPopups, getSchemas } from "@/lib/api";
import { fallbackNavigation } from "@/lib/content";
import { SITE } from "@/lib/siteConfig";
import { getCompanyBranding, getNavigationItems } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata() {
  const company = await getCompany();
  const siteName = company?.name || SITE.name;
  const description = company?.description || SITE.description;
  const keywords = company?.seo?.keywords?.length
    ? company.seo.keywords
    : ["gusto kartepe", "serpme kahvalti", "kartepe restoran", "kocaeli restoran", "doga restorani", "izgara"];

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${siteName} | Doganin Icinde Serpme Kahvalti & Izgara`,
      template: `%s | ${siteName}`,
    },
    description,
    keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: SITE.url,
      siteName,
      title: `${siteName} | Doganin Icinde Serpme Kahvalti & Izgara`,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Doganin Icinde Serpme Kahvalti & Izgara`,
      description,
      images: ["/opengraph-image"],
    },
    verification: company?.searchConsoleVerification
      ? {
          google: company.searchConsoleVerification,
        }
      : undefined,
    robots: { index: true, follow: true },
    alternates: { canonical: SITE.url },
    icons: company?.branding?.favicon
      ? { icon: company.branding.favicon, shortcut: company.branding.favicon, apple: company.branding.favicon }
      : undefined,
  };
}

export default async function RootLayout({ children }) {
  const [company, navigation, footerNavigation, globalSchemas, popups] = await Promise.all([
    getCompany(),
    getNavigation(),
    getFooterNavigation().catch(() => null),
    getSchemas("global"),
    getPopups().catch(() => []),
  ]);

  const branding = getCompanyBranding(company);
  const items = getNavigationItems(navigation);
  // footer-nav varsa kullan, yoksa main-nav'dan türet
  const footerItems = footerNavigation
    ? getNavigationItems(footerNavigation)
    : items;

  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body
        style={{
          "--brand-primary": branding.primary,
          "--brand-secondary": branding.secondary,
          "--brand-accent": branding.accent,
        }}
      >
        {company?.tagManagerId ? (
          <Script id="gtm-script" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${company.tagManagerId}');
          `}</Script>
        ) : null}
        {company?.analyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${company.analyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-script" strategy="afterInteractive">{`
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());
              gtag('config','${company.analyticsId}');
            `}</Script>
          </>
        ) : null}
        {company?.metaPixelId ? (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${company.metaPixelId}');fbq('track','PageView');
          `}</Script>
        ) : null}
        {company?.tagManagerId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${company.tagManagerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <RestaurantSchema company={company} />
        <DynamicSchemas schemas={globalSchemas} />
        <PopupManager popups={Array.isArray(popups) ? popups : []} />
        <Navbar items={items.length ? items : fallbackNavigation} company={company} />
        <div className="min-h-screen pt-[87px]">{children}</div>
        <Footer company={company} navItems={footerItems.length ? footerItems : (items.length ? items : fallbackNavigation)} />
        <DraftModeBanner />
      </body>
    </html>
  );
}
