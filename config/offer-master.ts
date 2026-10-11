/** Approved commercial MASTER v3.0, 11 October 2026. Invoice after written offer and contract approval. */
export const offerMasters = {
  visibility: {
    id: "instagram", version: "3.0", name: "Virella Näkyvyys",
    price: 490, commitmentMonths: 3, totalPrice: 1470, contentsPerMonth: 12, publicationsPerMonth: 24,
    invoiceDueDays: 7, revisionRounds: 1,
    continuation: "Jatkuu 3 kuukauden jälkeen toistaiseksi, 30 päivän kirjallinen irtisanomisaika",
    features: [
      "12 alkuperäistä sisältöä kuukaudessa; jokainen julkaistaan Instagramissa ja Facebookissa (24 kanavajulkaisua)",
      "Sisältösuunnittelu ja julkaisukalenteri",
      "Julkaisutekstit ja asiakkaan toimittaman kuvamateriaalin visuaalinen viimeistely",
      "Hyväksyttyjen sisältöjen ajastus ja julkaiseminen",
      "Yksi koottu korjauskierros kuukaudessa",
      "Kuukausiraportti",
    ],
    exclusions: ["Kuvaus paikan päällä", "Raskas video", "Maksettu mainonta ja mainosbudjetti", "Kommentti- ja viestipäivystys", "Muut kanavat", "Verkkosivutyö"],
  },
  landing: {
    id: "landing-page-seo", version: "3.0", name: "Landing Page + SEO",
    price: 990, deposit: 495, finalPayment: 495, invoiceDueDays: 7, revisionRounds: 1,
    features: [
      "Yksi suomenkielinen myyntisivu, yksi pääpalvelu ja yksi kohderyhmä",
      "Kevyt kohderyhmä- ja hakuintentioanalyysi",
      "Arvolupaus, CTA, rakenne, otsikot ja myynticopy",
      "Visuaalinen ja tekninen responsiivinen toteutus",
      "Yhteydenottolomake sovittuun sähköpostiin sekä onnistumisvahvistus",
      "SEO: title, meta description, H1–H3, canonical, indeksointiasetukset ja sitemap",
      "Esikatselu, yksi koottu korjauskierros ja kirjallinen hyväksyntä",
      "Julkaisu sovitulle verkkotunnukselle, toimivuustarkistus, lyhyt käyttöohje ja sovitun asiakaskohtaisen lähdekoodin luovutus",
    ],
    exclusions: ["Verkkotunnus", "Maksulliset kolmannen osapuolen palvelut", "Jatkuva ylläpito", "Jatkuva SEO", "Konversioanalytiikka", "Suostumusten hallinta"],
  },
} as const;
export function requiresWrittenOffer(productId: string): boolean {
  return productId === offerMasters.visibility.id || productId === offerMasters.landing.id || productId === "linkedin";
}

export const servicePricing = {
  google: { startup: 590, monthly: 290 },
  leads: { startup: 1500, monthlyFrom: 500 },
  website: { startupFrom: 1500 },
  foundation: { price: 2490 },
  growth: { startup: 1990, monthly: 890, commitmentMonths: 3, minimumTotal: 4660 },
} as const;
