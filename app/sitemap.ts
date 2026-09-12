import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/seo";

const isProduction = process.env.VERCEL_ENV === "production";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProduction) return [];

  const now = new Date();

  return [
    {
      url: `${seoConfig.siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${seoConfig.siteUrl}/instagram`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${seoConfig.siteUrl}/linkedin`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${seoConfig.siteUrl}/landing-page-seo`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${seoConfig.siteUrl}/verkkosivu-kuntoon`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${seoConfig.siteUrl}/tietosuoja`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
