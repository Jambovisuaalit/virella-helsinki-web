import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { seoConfig } from "@/config/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const isProduction = process.env.VERCEL_ENV === "production";
const GA_MEASUREMENT_ID = "G-43VQ8505YL";

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.defaultDescription,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: isProduction,
    follow: isProduction,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fi">
      <body className={inter.variable}>
        {isProduction ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`}
            </Script>
          </>
        ) : null}
        {children}
        <PageViewTracker enabled={isProduction} />
      </body>
    </html>
  );
}
