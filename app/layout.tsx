import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { seoConfig } from "@/config/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const isIndexable = process.env.SITE_INDEXABLE === "true";

export const metadata: Metadata = {
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.defaultDescription,
  robots: {
    index: isIndexable,
    follow: isIndexable,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fi">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
