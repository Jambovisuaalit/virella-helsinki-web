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
  websiteFix: {
    eyebrow: "Verkkosivun korjaukset · asiakaskohtainen tarjous",
    title: "Sivustosi ei aina tarvitse uusimista. Tärkeimmät korjaukset voidaan selvittää ensin.",
    lead: "Conversion Fix -kartoituksessa arvioimme nykyisen verkkosivustosi pääviestin, toimintakehotukset, mobiilikäytön, yhteydenottopolun ja luottamusta rakentavat kohdat. Saat kirjallisen tarjouksen rajatusta korjaustyöstä ennen päätöstä.",
    summary: "Korjattavat kohdat, toimitusmäärä, aikataulu, hinta sekä mahdolliset korjauskierrokset määritellään asiakaskohtaisessa kirjallisessa tarjouksessa. Aloituspyyntö ei velvoita ostamaan eikä käynnistä maksua tai työtä.",
    audienceTitle: "Kenelle verkkosivun rajattu korjaustyö voi sopia?",
    audience: [
      "Yritykselle, jonka nykyinen sivu ei kerro selkeästi palvelua tai toimialuetta",
      "Yritykselle, jonka mobiilikäyttö tai yhteydenottopolku kaipaa kehitystä",
      "Yritykselle, joka haluaa arvioida korjausmahdollisuudet ennen laajempaa verkkosivu-uudistusta",
    ],
    process: [
      { title: "Lähetä aloituspyyntö", text: "Kerro nykyisen verkkosivusi osoite ja tärkein kehitystavoite. Lähetys ei ole maksullinen tilaus. Salasanoja ei toimiteta lomakkeella." },
      { title: "Saat yksilöidyn tarjouksen", text: "Arvioimme toteutettavissa olevat korjaukset ja rajaamme kirjallisesti toimitussisällön, aikataulun, hinnan, hyväksynnät ja tarvittavat käyttöoikeudet." },
      { title: "Toteutus vasta hyväksynnästä", text: "Työ käynnistyy vasta kirjallisesti hyväksytyn tarjouksen ja sovittujen lähtöedellytysten täyttymisen jälkeen. Mahdolliset lisätyöt sovitaan erikseen." },
    ],
    faq: [
      { question: "Mitä Conversion Fix maksaa?", answer: "Kiinteää vakiohintaa ei ole vahvistettu. Saat korjattaviin kohtiin ja sivustosi tekniikkaan perustuvan kirjallisen tarjouksen ennen tilausta." },
      { question: "Kuuluuko tähän kokonaan uusi verkkosivu?", answer: "Ei automaattisesti. Korjauksia arvioidaan olemassa olevaan sivustoon. Laajempi uudistus tarjotaan erikseen, jos se on tarkoituksenmukaista." },
      { question: "Milloin korjaukset valmistuvat?", answer: "Aikataulu vahvistetaan asiakaskohtaisessa tarjouksessa korjausten laajuuden, sivuston tekniikan, materiaalien ja käyttöoikeuksien mukaan." },
      { question: "Voiko aloituspyynnön lähettää ilman ostositoumusta?", answer: "Kyllä. Aloituspyyntö on maksuton yhteydenotto. Maksullinen toimeksianto syntyy vasta erikseen hyväksyttävällä kirjallisella tarjouksella ja sopimuksella." },
    ],
  },
  instagram: {
    eyebrow: "Instagram-markkinointi yrityksille",
    title: "Instagram-markkinointi valmiina palveluna.",
    lead: "Virella tuottaa 12 alkuperäistä sisältöä kuukaudessa. Jokainen asiakkaan hyväksymä sisältö julkaistaan sekä Instagramissa että Facebookissa.",
    summary: "490 €/kk, kolmen kuukauden aloitusjakso yhteensä 1 470 €. Sisältää 12 sisältöä, 24 kanavajulkaisua, yhden kootun korjauskierroksen ja raportin kuukaudessa. Kirjallinen tarjous hyväksytään ennen laskutusta.",
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
    summary: "Julkaisumäärä, hinta, mahdollinen profiilin optimointi, raportointi ja sopimuskausi määritellään asiakaskohtaisessa kirjallisessa tarjouksessa. Aloituspyyntö ei sido ostamaan.",
    audienceTitle: "Kenelle LinkedIn-palvelu sopii?",
    audience: [
      "B2B-palveluyritykselle, joka haluaa vahvistaa asiantuntijanäkyvyyttä",
      "Yrittäjälle tai asiantuntijalle, jolla on sanottavaa mutta liian vähän aikaa kirjoittaa",
      "Yritykselle, joka haluaa rakentaa johdonmukaista läsnäoloa ilman omaa sisältötiimiä",
    ],
    process: [
      { title: "Aloituskysely", text: "Kartoitamme asiantuntemuksen, kohderyhmän, palvelut ja tavoitellun LinkedIn-roolin." },
      { title: "Sisältöstrategia", text: "Määritämme aiheet, näkökulmat ja julkaisurytmin kirjallisen tarjouksen ja hyväksyttyjen lähtötietojen perusteella." },
      { title: "Julkaisut ja optimointi", text: "Toteutamme vain erikseen sovitut julkaisut ja mahdollisen profiilin kehityksen asiakkaan hyväksynnällä." },
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
    summary: "990 € kertamaksu: 495 € ennen tuotannon aloitusta ja 495 € hyväksytyn esikatselun jälkeen ennen julkaisua. Yksi suomenkielinen myyntisivu, copy, yhteydenottolomake, SEO-perusteet ja yksi korjauskierros. Analytiikka ja suostumusten hallinta eivät sisälly.",
    audienceTitle: "Kenelle Landing Page + SEO sopii?",
    audience: [
      "Yritykselle, joka tarvitsee yhden selkeän palvelu- tai kampanjasivun",
      "Palveluyritykselle, jonka nykyinen sivu ei ohjaa yhteydenottoon riittävän selkeästi",
      "Yritykselle, joka haluaa yhdistää konversiorakenteen ja teknisen SEO-perustan samaan toimitukseen",
    ],
    process: [
      { title: "Tarjous ja hyväksyntä", text: "Lähetämme kirjallisen tarjouksen ja ehdot. Työ alkaa hyväksynnän, 495 € ennakkomaksun sekä materiaalien ja käyttöoikeuksien jälkeen." },
      { title: "Rakenne ja sisältö", text: "Suunnittelemme sivun viestihierarkian, CTA-polun ja SEO-kriittisen sisällön." },
      { title: "Esikatselu ja julkaisu", text: "Toteutamme sivun, testaamme lomakkeen ja SEO-asetukset sekä pyydämme kirjallisen hyväksynnän. Loppumaksu 495 € ennen julkaisua." },
    ],
    faq: [
      { question: "Sisältyykö hakukoneoptimointi toimitukseen?", answer: "Kyllä. Palveluun kuuluu sivukohtainen on-page SEO ja tekninen perusoptimointi." },
      { question: "Onko kyse kokonaisesta verkkosivustosta?", answer: "Ei. Toteutus koskee yhtä suomenkielistä myyntisivua, yhtä pääpalvelua ja yhtä kohderyhmää." },
      { question: "Sisältyvätkö analytiikka ja ylläpito?", answer: "Eivät. Analytiikka, suostumusten hallinta, verkkotunnus, maksulliset työkalut ja jatkuva ylläpito tai SEO hinnoitellaan erikseen." },
    ],
  },
};
