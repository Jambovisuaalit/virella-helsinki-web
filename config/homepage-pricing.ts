import { products } from "@/config/products";

// MASTER v3.0 prices. All domestic prices are the amount payable; no VAT is added
// while Tmi Jami Harju remains outside VAT registration.
export const homepagePricing = {
  social: {
    secondaryLabel: "Kuukausipalvelu",
    startup: "Ei erillistä aloitusmaksua",
    monthly: `${products.instagram.price} €/kk`,
    note: `${products.instagram.commitmentMonths} kk vähimmäisjakso`,
  },
  google: {
    secondaryLabel: "Valinnainen ylläpito",
    startup: "590 €",
    monthly: "Ylläpito 290 €/kk, valinnainen",
    note: "Ylläpito sovitaan ja tilataan erikseen",
  },
  website: {
    secondaryLabel: "Laajempi sivusto · kertahinta",
    startup: `Landing Page + SEO ${products.landingPageSeo.price} €`,
    monthly: "1–5 sivua alk. 1 500 €",
    note: "Ei automaattista kuukausiylläpitoa",
  },
} as const;

// Confirmed service register v3.1, 11 October 2026. These are offer-only
// comparison entries, not new self-service checkout products.
export const websitePackages = [
  { name: "Landing Page + SEO", price: products.landingPageSeo.price, from: false, description: "Yksi suomenkielinen myyntisivu, tekstit, yhteydenottolomake ja teknisen SEO:n perusteet. Yksi koottu korjauskierros. Analytiikka ja jatkuva ylläpito erikseen.", href: "/aloita?product=landing-page-seo" },
  { name: "Virella Liidit", price: 1500, from: false, description: "Yksi laskeutumissivu, myyntitekstit, yhteydenottopolku sekä analytiikan ja konversioseurannan perustaminen. Yksi koottu korjauskierros. Ylläpito erillisellä tilauksella.", href: "/aloita" },
  { name: "Verkkosivut 1–5 sivua", price: 1500, from: true, description: "Sovittu sivukartta, responsiivinen toteutus, yhteydenottolomake, teknisen SEO:n perustaso ja analytiikan perusasennus. Laaja tekstintuotanto, domain, hosting ja ylläpito erikseen.", href: "/aloita" },
] as const;
