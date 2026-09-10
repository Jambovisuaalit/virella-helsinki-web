import type { Product } from "@/types/product";

export const products = {
  instagram: {
    id: "instagram",
    name: "Instagram 3 kk -kampanja",
    price: 490,
    billing: "month",
    commitmentMonths: 3,
    totalPrice: 1470,
    features: [
      "12–25 feed-julkaisua / kk",
      "Viikoittaiset Stories",
      "Reels / lyhytvideot",
      "Sisältösuunnittelu",
      "Hashtag-strategia",
      "Kommenttien hallinta",
      "Kuukausiraportointi ja analytiikka",
    ],
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn Starttipaketti",
    price: 490,
    billing: "month",
    commitmentMonths: 3,
    totalPrice: 1470,
    features: [
      "4–8 julkaisua / kk",
      "Sisältöstrategia",
      "Profiilin optimointi",
      "Kuukausiraportointi",
    ],
  },
  landingPageSeo: {
    id: "landing-page-seo",
    name: "Landing Page + SEO",
    price: 390,
    billing: "one_time",
    features: [
      "Responsiivinen landing page",
      "On-page SEO",
      "Suorituskyvyn optimointi",
      "Analytiikan integrointi",
    ],
  },
} satisfies Record<string, Product>;

export type ProductId = keyof typeof products;
