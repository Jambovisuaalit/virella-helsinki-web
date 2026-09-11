import { brandConfig } from "@/config/brand";

export const seoConfig = {
  siteName: brandConfig.name,
  siteUrl: "https://virellahelsinki.com",
  defaultTitle: brandConfig.name,
  titleTemplate: `%s | ${brandConfig.name}`,
  defaultDescription: "Virella Helsinki tekee markkinoinnista selkeän, valmiin palvelun suomalaisille yrityksille.",
} as const;
