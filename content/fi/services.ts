import type { ProductId } from "@/config/products";

type ServicePageContent = {
  eyebrow: string;
  title: string;
  lead: string;
  summary: string;
  audienceTitle: string;
  audience: string[];
  process: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
};

export const servicePageContent: Record<ProductId, ServicePageContent> = {
  instagram: {
    eyebrow: "Instagram-markkinointi yrityksille",
    title: "Instagram-markkinointi valmiina palveluna.",
    lead: "Virella suunnittelee ja toteuttaa yrityksesi Instagram-sisällön, jotta näkyvyys ei jää muun työn jalkoihin.",
    summary: "Saat selkeän kuukausittaisen sisältömallin, suunnittelun, julkaisujen toteutuksen ja raportoinnin yhdestä paikasta.",
    audienceTitle: "Kenelle Instagram-palvelu sopii?",
    audience: [
      "Yritykselle, jolla ei ole omaa markkinointitiimiä",
      "Yrittäjälle, jonka oma aika kuluu asiakastyöhön",
      "Palveluyritykselle, joka haluaa näkyä säännöllisesti ja ammattimaisesti",
    ],
    process: [
      { title: "Aloituskysely", text: "Keräämme liiketoiminnan, asiakkaiden ja sisällön kannalta olennaiset lähtötiedot." },
      { title: "Sisältösuunnitelma", text: "Muodostamme palveluun kuuluvan sisältörakenteen ja julkaisurytmin." },
      { title: "Toteutus ja seuranta", text: "Sisältö tuotetaan sovitun mallin mukaan ja kehitystä seurataan kuukausittain." },
    ],
    faq: [
      { question: "Tarvitsenko valmiita sisältöideoita?", answer: "Et. Lähtötiedot kerätään alkukyselyllä ja Virella rakentaa sisältösuunnitelman niiden pohjalta." },
      { question: "Onko palvelu tarkoitettu vain kuluttajayrityksille?", answer: "Ei. Palvelu voidaan sovittaa sekä B2C- että B2B-palveluyrityksen näkyvyyteen." },
    ],
  },
  linkedin: {
    eyebrow: "LinkedIn-markkinointi yrityksille",
    title: "LinkedIn-sisältö ilman jatkuvaa kirjoittamisrumbaa.",
    lead: "Virella auttaa yritystäsi tai asiantuntijabrändiäsi näkymään LinkedInissä johdonmukaisesti, selkeästi ja oman alan asiantuntemukseen nojaten.",
    summary: "Palvelu yhdistää sisältöstrategian, julkaisujen toteutuksen, profiilin optimoinnin ja kuukausittaisen raportoinnin.",
    audienceTitle: "Kenelle LinkedIn-palvelu sopii?",
    audience: [
      "B2B-palveluyritykselle, joka haluaa vahvistaa asiantuntijanäkyvyyttä",
      "Yrittäjälle tai asiantuntijalle, jolla on sanottavaa mutta liian vähän aikaa kirjoittaa",
      "Yritykselle, joka haluaa rakentaa johdonmukaista läsnäoloa ilman omaa sisältötiimiä",
    ],
    process: [
      { title: "Aloituskysely", text: "Kartoitamme asiantuntemuksen, kohderyhmän, palvelut ja tavoitellun LinkedIn-roolin." },
      { title: "Sisältöstrategia", text: "Määritämme aiheet, näkökulmat ja julkaisurytmin ennen tuotannon käynnistymistä." },
      { title: "Julkaisut ja optimointi", text: "Sisältö tuotetaan sovitun mallin mukaan ja profiilin kokonaisuutta kehitetään rinnalla." },
    ],
    faq: [
      { question: "Kirjoitetaanko julkaisut puolestani?", answer: "Kyllä. Sisältö rakennetaan alkukyselyn ja sovitun sisältöstrategian pohjalta." },
      { question: "Voiko palvelu keskittyä yrityssivuun?", answer: "Kyllä. Toteutus voidaan painottaa henkilöprofiiliin, yrityssivuun tai niiden yhdistelmään lähtötilanteen mukaan." },
    ],
  },
  landingPageSeo: {
    eyebrow: "Landing Page + SEO",
    title: "Selkeä laskeutumissivu, jolla on yksi tehtävä.",
    lead: "Virella rakentaa responsiivisen landing pagen, jonka sisältö, tekninen toteutus ja hakukoneperusta ohjaavat kävijää kohti seuraavaa toimintaa.",
    summary: "Kertatoimitus sisältää responsiivisen landing pagen, on-page SEO:n, suorituskyvyn optimoinnin ja analytiikan integroinnin.",
    audienceTitle: "Kenelle Landing Page + SEO sopii?",
    audience: [
      "Yritykselle, joka tarvitsee yhden selkeän palvelu- tai kampanjasivun",
      "Palveluyritykselle, jonka nykyinen sivu ei ohjaa yhteydenottoon riittävän selkeästi",
      "Yritykselle, joka haluaa yhdistää konversiorakenteen ja teknisen SEO-perustan samaan toimitukseen",
    ],
    process: [
      { title: "Aloituskysely", text: "Keräämme palvelun, kohderyhmän, kilpailuedut ja tarvittavat materiaalit." },
      { title: "Rakenne ja sisältö", text: "Suunnittelemme sivun viestihierarkian, CTA-polun ja SEO-kriittisen sisällön." },
      { title: "Toteutus ja julkaisuvalmius", text: "Rakennamme responsiivisen sivun, optimoimme suorituskyvyn ja viimeistelemme tekniset perusteet." },
    ],
    faq: [
      { question: "Sisältyykö hakukoneoptimointi toimitukseen?", answer: "Kyllä. Palveluun kuuluu sivukohtainen on-page SEO ja tekninen perusoptimointi." },
      { question: "Onko kyse kokonaisesta verkkosivustosta?", answer: "Ei. Palvelu on rajattu yhteen selkeään landing page -kokonaisuuteen." },
    ],
  },
};
