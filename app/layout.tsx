import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnalyticsConsent } from "@/components/analytics/analytics-consent";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { seoConfig } from "@/config/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const isProduction = process.env.VERCEL_ENV === "production";

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
        {children}
        <PageViewTracker enabled={isProduction} />
        <AnalyticsConsent enabled={isProduction} />
      </body>
    </html>
  );
}
