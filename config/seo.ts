import { brandConfig } from "@/config/brand";

export const seoConfig = {
  siteName: brandConfig.name,
  siteUrl: "https://virellahelsinki.com",
  defaultTitle: "Digitaalista näkyvyyttä paikallisille yrityksille | Virella Helsinki",
  titleTemplate: `%s | ${brandConfig.name}`,
  defaultDescription: "Virella Helsinki auttaa paikallisia palveluyrityksiä löytymään Googlesta, näyttämään uskottavilta verkossa ja saamaan enemmän yhteydenottoja.",
} as const;
