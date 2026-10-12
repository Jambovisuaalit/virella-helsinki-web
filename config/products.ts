import type { Product } from "@/types/product";
import { offerMasters } from "@/config/offer-master";

export const products = {
  websiteFix: {
    id: "verkkosivu-kuntoon",
    name: "Verkkosivun korjaukset (Conversion Fix)",
    price: null,
    billing: "quote",
    features: [
      "Nykyisen verkkosivuston pääviestin ja CTA-polun kartoitus",
      "Mobiilikäytettävyyden ja lomakkeen toimivuuden arviointi",
      "Luottamustekijöiden ja SEO-perustan arviointi",
      "Korjattavat kohdat, toimituslaajuus, hinta ja aikataulu yksilöidään tarjoukseen",
      "Korjauskierrokset ja käyttöönotto sovitaan kirjallisesti ennen tilausta",
    ],
  },
  instagram: {
    id: "instagram",
    name: "Instagram + Facebook 3 kk -paketti",
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
    billing: "quote",
    features: [
      "Julkaisumäärä ja -rytmi sovitaan asiakaskohtaisesti",
      "Sisältöstrategia määritellään tarjouksessa",
      "Mahdollinen profiilin optimointi ja raportointi sovitaan erikseen",
      "Hinta, sopimuskausi ja hyväksyntäkäytännöt vahvistetaan kirjallisesti",
    ],
  },
  landingPageSeo: {
    id: "landing-page-seo",
    name: "Landing Page + SEO",
    price: offerMasters.landing.price,
    deposit: offerMasters.landing.deposit,
    finalPayment: offerMasters.landing.finalPayment,
    billing: "one_time",
    features: [...offerMasters.landing.features],
  },
} satisfies Record<string, Product>;

export type ProductId = keyof typeof products;
