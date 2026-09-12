import { brandConfig } from "@/config/brand";

export const seoConfig = {
  siteName: brandConfig.name,
  siteUrl: "https://virellahelsinki.com",
  defaultTitle: "Conversion Fix — verkkosivun myyntiesteet kuntoon 72 h",
  titleTemplate: `%s | ${brandConfig.name}`,
  defaultDescription: "Conversion Fix korjaa nykyisen verkkosivun tärkeimmät myyntiä estävät kohdat 72 tunnissa kiinteällä 690 € kertamaksulla.",
} as const;
