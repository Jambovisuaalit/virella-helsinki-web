import { brandConfig } from "@/config/brand";

export const seoConfig = {
  siteName: brandConfig.name,
  siteUrl: "https://virellahelsinki.com",
  defaultTitle: "Conversion Fix — helpompi yhteydenotto nykyiseltä verkkosivulta",
  titleTemplate: `%s | ${brandConfig.name}`,
  defaultDescription: "Conversion Fix korjaa nykyisen verkkosivusi tärkeimmät yhteydenottoa vaikeuttavat kohdat kiinteällä 690 € kertamaksulla ilman täyttä verkkosivuprojektia.",
} as const;
