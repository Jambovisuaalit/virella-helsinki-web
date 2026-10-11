import { products } from "@/config/products";

// MASTER v3.0 prices. All domestic prices are the amount payable; no VAT is added
// while Tmi Jami Harju remains outside VAT registration.
export const homepagePricing = {
  social: {
    startup: "Ei erillistä aloitusmaksua",
    monthly: `${products.instagram.price} €/kk`,
    note: `${products.instagram.commitmentMonths} kk vähimmäisjakso`,
  },
  google: {
    startup: "590 €",
    monthly: "Ylläpito 290 €/kk, valinnainen",
    note: "Ylläpito sovitaan ja tilataan erikseen",
  },
  website: {
    startup: "Landing Page + SEO 990 €",
    monthly: "Laajemmat verkkosivut alk. 1 500 €",
    note: "Ei automaattista kuukausiylläpitoa",
  },
} as const;
