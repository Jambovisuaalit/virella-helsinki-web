import { products } from "@/config/products";
import { servicePricing } from "@/config/offer-master";

const euro = new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export const homepagePricing = {
  social: {
    startup: "Ei erillistä aloitusmaksua",
    monthly: `${products.instagram.price} €/kk`,
    note: `${products.instagram.commitmentMonths} kk aloitusjakso, sitten toistaiseksi. Kirjallinen irtisanomisaika 30 päivää.`,
  },
  google: {
    startup: euro.format(servicePricing.google.startup),
    monthly: `${servicePricing.google.monthly} €/kk (valinnainen)`,
    note: "Ylläpito vain erillisellä kirjallisella tilauksella.",
  },
  website: {
    startup: `Alkaen ${euro.format(servicePricing.website.startupFrom)}`,
    monthly: "Ylläpito tarjouksen mukaan",
    note: "1–5 sivua sovitulla sivukartalla. Ylläpito tilataan erikseen.",
  },
} as const;
