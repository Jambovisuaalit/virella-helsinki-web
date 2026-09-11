import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/seo";

const isProduction = process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/alkukysely", "/checkout"],
    },
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
    host: seoConfig.siteUrl,
  };
}
