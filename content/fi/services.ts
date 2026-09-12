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
    eyebrow: "Conversion Fix · 690 € · toimitus 72 h",
    title: "Sivustosi ei tarvitse aina uusimista. Sen pitää tehdä yhteydenotosta helpompi.",
    lead: "Conversion Fix korjaa nykyisen verkkosivusi kohdat, jotka vaikeuttavat asiakkaan seuraavaa askelta. Selkeytämme viestin, toimintakehotukset, mobiilikokemuksen, yhteydenottopolun ja tärkeimmät luottamusta rakentavat kohdat kiinteällä 690 € hinnalla — ilman täyttä verkkosivuprojektia.",
    summary: "Saat konkreettiset muutokset nykyiseen sivuun, et pelkkää auditointiraporttia. Korjaamme sovitut kohdat, tarkistamme lopputuloksen ja toimitamme ennen/jälkeen-yhteenvedon. Jos sivusto vaatii tätä laajemman uudistuksen, se erotetaan tästä työstä eikä lisätöitä tehdä ilman hyväksyntääsi.",
    audienceTitle: "Conversion Fix sopii, kun sivu on olemassa mutta se ei ohjaa tarpeeksi selkeästi yhteydenottoon.",
    audience: [
      "Asiakas ei ymmärrä heti, mitä tarjoat, kenelle palvelu on tai miksi juuri sinuun kannattaa ottaa yhteyttä",
      "Yhteydenottopainikkeet, lomake tai mobiilikäyttö tekevät asioinnista turhan vaikeaa",
      "Haluat korjata nykyisen sivun tärkeimmät ongelmat nopeasti ilman kuukausien verkkosivuprojektia",
    ],
    process: [
      { title: "Osta ja anna lähtötiedot", text: "Maksat 690 € verkossa ja täytät lyhyen aloituskyselyn. Tarvitsemme nykyisen sivuston osoitteen, tavoitteen sekä toteutukseen tarvittavat materiaalit tai käyttöoikeudet. Salasanoja ei lähetetä lomakkeella." },
      { title: "Korjaamme tärkeimmät kitkakohdat", text: "Käymme läpi pääviestin, toimintakehotukset, mobiilikäytön, yhteydenottopolun, luottamusta rakentavat elementit sekä perustason SEO- ja metatiedot. Toteutamme palveluun kuuluvat sovitut korjaukset suoraan nykyiseen sivuun." },
      { title: "Saat valmiit muutokset ja yhteenvedon", text: "Toimitamme tehdyt korjaukset, ennen/jälkeen-yhteenvedon ja yhden kootun korjauskierroksen. Jos löydämme tämän palvelun ulkopuolelle jäävän suuremman ongelman, kerromme siitä erikseen — mitään lisätyötä ei tehdä automaattisesti." },
    ],
    faq: [
      { question: "Mitä 690 € sisältää?", answer: "Nykyisen sivun läpikäynnin ja sovitut korjaukset kahdeksalla osa-alueella: pääviesti, toimintakehotukset, mobiilikäyttö, yhteydenottopolku, luottamusta rakentavat elementit, perustason SEO ja metatiedot, ennen/jälkeen-yhteenveto sekä yksi koottu korjauskierros." },
      { question: "Rakennatteko tällä hinnalla kokonaan uuden verkkosivun?", answer: "Emme. Conversion Fix on tarkoitettu olemassa olevan sivuston tärkeimpien myyntiä ja yhteydenottoa heikentävien kohtien korjaamiseen. Uusi sivusto, laaja brändiuudistus, CRM, maksettu mainonta, jatkuva SEO tai laajat integraatiot sovitaan erikseen." },
      { question: "Milloin 72 tunnin toimitusaika alkaa?", answer: "72 tuntia alkaa, kun maksu, aloituskysely ja toteutukseen tarvittavat materiaalit tai käyttöoikeudet ovat käytettävissä. Asiakkaasta tai kolmannesta osapuolesta johtuva odotus ei kuluta toimitusaikaa." },
      { question: "Tarvitseeko minun ostaa jatkopalvelua?", answer: "Ei. Conversion Fix on itsenäinen 690 € kertatoimitus. Jos työn aikana löytyy suurempi ongelma, saat siitä erillisen havainnon ja mahdollisen ehdotuksen. Jatkotyö tehdään vain, jos hyväksyt sen erikseen." },
    ],
  },
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
