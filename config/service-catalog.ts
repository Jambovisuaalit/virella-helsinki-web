import { offerMasters, servicePricing } from "@/config/offer-master";

const euro = new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const serviceCatalog = [
  {
    name: offerMasters.visibility.name, price: `${euro.format(offerMasters.visibility.price)}/kk`,
    terms: `3 kk aloitusjakso yhteensä ${euro.format(offerMasters.visibility.totalPrice)}. Sen jälkeen toistaiseksi samalla hinnalla, kirjallinen irtisanomisaika 30 päivää. Päättyy aikaisintaan aloitusjakson jälkeen.`,
    scope: "12 alkuperäistä sisältöä kuukaudessa, jokainen Instagramiin ja Facebookiin (24 kanavajulkaisua). Sisältökalenteri, tekstit, asiakkaan kuvamateriaalin viimeistely, hyväksyttyjen sisältöjen julkaiseminen, yksi koottu korjauskierros ja kuukausiraportti.",
    exclusions: "Ei kuvauskeikkaa, raskasta videota, maksettua mainontaa, mainosbudjettia, kommentti- tai viestipäivystystä, muita kanavia eikä verkkosivutyötä.",
    href: "/instagram",
  },
  {
    name: offerMasters.landing.name, price: euro.format(offerMasters.landing.price),
    terms: `${euro.format(offerMasters.landing.deposit)} hyväksytyn tilauksen jälkeen ennen tuotantoa ja ${euro.format(offerMasters.landing.finalPayment)} hyväksytyn esikatselun jälkeen ennen julkaisua. Kertaprojekti.`,
    scope: "Yksi suomenkielinen myyntisivu yhdelle palvelulle ja kohderyhmälle. Kevyt hakuintentioanalyysi, rakenne, myyntitekstit, CTA, responsiivinen toteutus, lomake onnistumisvahvistuksella, tekninen SEO-perusta, yksi korjauskierros, domain-julkaisu, käyttöohje ja sovitun asiakaskohtaisen lähdekoodin luovutus.",
    exclusions: "Ei analytiikkaa, konversioseurantaa, suostumusten hallintaa, domain-maksuja, lisenssejä, jatkuvaa ylläpitoa tai SEO:ta, useita sivuja, verkkokauppaa eikä integraatioita ilman erillistä tilausta.",
    href: "/landing-page-seo",
  },
  {
    name: "Virella Löydettävyys", price: `${euro.format(servicePricing.google.startup)} aloitus`,
    terms: `Valinnainen ylläpito ${euro.format(servicePricing.google.monthly)}/kk vain erillisellä kirjallisella tilauksella. Kolmen kuukauden suositus ei itsessään ole sitova vähimmäisjakso.`,
    scope: "Yhden Google Business Profile -profiilin auditointi, omistus- ja käyttöoikeudet, kategoriat, kuvaus, palvelut, yhteystiedot, palvelualueet, URL/UTM-perustaso, kuvaohje, arvostelupyyntömalli ja lähtöraportti. Ylläpidossa tietojen seuranta, enintään 4 Google-julkaisua/kk, asiakkaan kuvat, sovittu Q&A, arvosteluseuranta, enintään 10 vastausluonnosta/kk, raportti ja yksi kehitystoimi/kk.",
    exclusions: "Ei Google Adsia, laajaa teknistä SEO:ta, lisätoimipisteitä eikä hakusijoitustakuuta.",
    href: "/aloita",
  },
  {
    name: "Virella Liidit", price: `${euro.format(servicePricing.leads.startup)} aloitus`,
    terms: `Valinnainen ylläpito alkaen ${euro.format(servicePricing.leads.monthlyFrom)}/kk vain erillisellä kirjallisella tilauksella. Työmäärä, laskutus ja sopimuskausi yksilöidään tarjouksessa.`,
    scope: "Yksi konversioon suunniteltu laskeutumissivu: arvolupaus, copy, puhelu-/WhatsApp-/lomake-CTA:t tarpeen mukaan, yhteydenottolomake, mobiilitoteutus, SEO-perusta, analytiikan ja konversioseurannan perustaminen, kiitosviesti/-sivu ja yksi korjauskierros. Valinnaisessa ylläpidossa toimivuus, liidiseuranta, raportti ja kuukausittainen optimointi, vakiona enintään 2 h kehitystyötä/kk.",
    exclusions: "Ei CRM-rakennusta, räätälöityä backendia, verkkokauppaa, monimutkaista ajanvarausta, mainosbudjettia eikä taattua liidimäärää.",
    href: "/aloita",
  },
  {
    name: "Verkkosivut 1–5 sivua", price: `Alkaen ${euro.format(servicePricing.website.startupFrom)}`,
    terms: "Sivukartta ja kokonaishinta tarjouksessa. Maksuerät tyypillisesti 50 % ennen tuotantoa ja 50 % ennen julkaisua. Ylläpito tarjouksen mukaan ja vain erillisellä tilauksella.",
    scope: "1–5 suomenkielistä sivua sovitulla sivukartalla, responsiivinen toteutus, yhteydenottolomake, CTA:t, meta- ja teknisen SEO:n perustaso, analytiikan perusasennus ja yksi koottu korjauskierros.",
    exclusions: "Sisältölaajennukset, kieliversiot, integraatiot, brändiuudistus, domain-/hostingkulut, jatkuva ylläpito ja laaja tekstintuotanto erikseen.",
    href: "/aloita",
  },
  {
    name: "Virella Perusta", price: euro.format(servicePricing.foundation.price),
    terms: "Kertatoimitus. Maksuerät yksilöidään tarjouksessa. Ylläpidot ja kuukaudet 2+ vaativat erillisen tilauksen.",
    scope: "1–5 sivun verkkosivu, Google Business Profile -aloitus, selkeä yhteydenottopolku ja analytiikka sekä ensimmäisen kuukauden 12 some-sisältöä julkaistuna Instagramissa ja Facebookissa.",
    exclusions: "Jatkuva ylläpito ja seuraavien kuukausien somepalvelu eivät sisälly kertapakettiin.",
    href: "/aloita",
  },
  {
    name: "Virella Kasvu", price: `${euro.format(servicePricing.growth.startup)} + ${euro.format(servicePricing.growth.monthly)}/kk`,
    terms: `Kuukausipalvelun vähimmäisjakso ${servicePricing.growth.commitmentMonths} kk. Aloitus ja vähimmäiskausi yhteensä ${euro.format(servicePricing.growth.minimumTotal)}, kun kuukausimaksut alkavat aloitusjakson alussa. Erien aloitus, jatkuminen ja irtisanominen sovitaan tarjouksessa.`,
    scope: "Yksi laskeutumissivu, Google Business Profile -ylläpito, 12 alkuperäistä sisältöä/kk Instagramiin ja Facebookiin sekä kuukausittainen analytiikka- ja kehityskierros.",
    exclusions: "Lisätyöt ja kolmansien osapuolten maksulliset palvelut sovitaan erikseen.",
    href: "/aloita",
  },
  {
    name: "LinkedIn-sisällöntuotanto", price: "Tarjouksen mukaan",
    terms: "Tarkka julkaisumäärä, toimitussisältö, hinta, sopimuskausi ja jatko sovitaan aina tapauskohtaisesti kirjallisessa tarjouksessa.",
    scope: "Sisällöntuotanto henkilöprofiiliin, yrityssivuun tai sovittuun yhdistelmään asiakkaan tavoitteiden mukaan. Julkaisu vaatii nimetyn hyväksyjän kirjallisen luvan.",
    exclusions: "LinkedIn ei kuulu Virella Näkyvyys -pakettiin.",
    href: "/linkedin",
  },
] as const;
