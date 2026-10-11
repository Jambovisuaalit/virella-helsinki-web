import type { Product } from "@/types/product";
import { offerMasters } from "@/config/offer-master";

export const products = {
  websiteFix: {
    id: "verkkosivu-kuntoon",
    name: "Conversion Fix",
    price: 690,
    billing: "one_time",
    features: [
      "Etusivun pääviesti selkeäksi",
      "Toimintakehotukset ja tärkeimmät painikkeet kuntoon",
      "Mobiilin kriittiset kitkakohdat pois",
      "Yhteydenottolomake tai yhteydenottopolku kuntoon",
      "Luottamusta rakentavat kohdat selkeämmiksi",
      "SEO- ja metatietojen perustarkistus",
      "Ennen/jälkeen-yhteenveto tehdyistä muutoksista",
      "Yksi koottu korjauskierros",
    ],
  },
  instagram: {
    id: "instagram",
    name: offerMasters.visibility.name,
    price: offerMasters.visibility.price,
    billing: "month",
    commitmentMonths: offerMasters.visibility.commitmentMonths,
    totalPrice: offerMasters.visibility.totalPrice,
    features: [...offerMasters.visibility.features],
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn-sisällöntuotanto",
    price: null,
    billing: "month",
    commitmentMonths: undefined,
    totalPrice: undefined,
    features: [
      "Julkaisumäärä ja sisältö määritellään tarjouksessa",
      "Henkilöprofiili, yrityssivu tai sovittu yhdistelmä",
      "Hinta, sopimuskausi ja jatko sovitaan kirjallisesti",
      "Nimetyn hyväksyjän kirjallinen lupa ennen julkaisua",
    ],
  },
  landingPageSeo: {
    id: "landing-page-seo",
    name: "Landing Page + SEO",
    price: offerMasters.landing.price,
    billing: "one_time",
    features: [...offerMasters.landing.features],
  },
} satisfies Record<string, Product>;

export type ProductId = keyof typeof products;
