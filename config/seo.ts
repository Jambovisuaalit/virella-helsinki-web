import { brandConfig } from "@/config/brand";

export const seoConfig = {
  siteName: brandConfig.name,
  siteUrl: "https://virellahelsinki.com",
  defaultTitle: "Verkkosivut, Google-näkyvyys ja some | Virella Helsinki",
  titleTemplate: `%s | ${brandConfig.name}`,
  defaultDescription: "Virella Helsinki toteuttaa paikallisille palveluyrityksille verkkosivuja, Google-näkyvyyttä ja somepalveluita. Maksuton kartoitus: 3 korjausehdotusta 2 arkipäivässä.",
} as const;
