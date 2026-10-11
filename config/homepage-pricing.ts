import { products } from "@/config/products";

// Existing homepage offer prices; presentation changes do not alter the offers.
export const homepagePricing = {
  social: {
    startup: "Ei erillistä aloitusmaksua",
    monthly: `${products.instagram.price} €/kk`,
    note: `${products.instagram.commitmentMonths} kk vähimmäisjakso`,
  },
  google: {
    startup: "590 €",
    monthly: "290 €/kk",
    note: "Google-näkyvyyden ylläpito ja kehitys",
  },
  website: {
    startup: "1 500 €",
    monthly: "Alkaen 500 €/kk",
    note: "Sivuston ylläpito ja kehitys",
  },
} as const;
