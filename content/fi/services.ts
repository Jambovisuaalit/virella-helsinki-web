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
    eyebrow: "Verkkosivu kuntoon 72 h",
    title: "Korjataan verkkosivusi tärkeimmät myyntiä estävät kohdat.",
    lead: "Kiinteä 690 € kertamaksu. Saat nykyiseen sivustoosi rajatut, konkreettiset korjaukset ilman pitkää projektia tai myyntipalaveria. 72 tunnin toimitusaika alkaa, kun tarvittavat lähtötiedot ja käyttöoikeudet ovat käytettävissä.",
    summary: "Tämä ei ole uusi verkkosivusto. Käymme nykyisen sivun läpi, priorisoimme tärkeimmät yhteydenottoa heikentävät kohdat ja korjaamme sovitun entry-scopen. Lopuksi saat ennen/jälkeen-yhteenvedon sekä havainnot mahdollisista seuraavista kaupallisista pullonkauloista.",
    audienceTitle: "Kenelle 690 € korjaus sopii?",
    audience: [
      "Palveluyritykselle, jonka sivusto on jo olemassa mutta yhteydenottopolku on epäselvä tai heikko",
      "Yrittäjälle, joka haluaa konkreettisen korjauksen ilman pitkää verkkosivuprojektia",
      "Yritykselle, joka haluaa ensin parantaa näkyvää asiakaspolkua ja päättää vasta datan perusteella mahdollisista jatkotoimista",
    ],
    process: [
      { title: "Maksa ja täytä aloituskysely", text: "Maksat 690 € verkossa ja annat nykyisen sivuston, tavoitteen sekä tarvittavat lähtötiedot. Salasanoja ei lähetetä lomakkeella." },
      { title: "Auditointi ja korjaukset", text: "Tarkistamme sivun pääviestin, CTA-polun, mobiilin käytettävyyden, yhteydenottopolun, luottamuselementit ja perustason SEO/metatiedot. Toteutamme entry-scopeen kuuluvat priorisoidut korjaukset." },
      { title: "Toimitus ja havainnot", text: "Saat ennen/jälkeen-yhteenvedon, yhden kootun korjauskierroksen sekä erillisen listan mahdollisista kaupallisista havainnoista. Jatkotyötä ei tehdä automaattisesti." },
    ],
    faq: [
      { question: "Mitä 690 € sisältää?", answer: "Nykyisen sivuston konversioauditoinnin, etusivun pääviestin ja CTA-polun korjauksen, mobiilin kriittiset korjaukset, yhteydenottopolun tarkistuksen ja korjauksen, palvelun ja luottamuselementtien selkeytyksen, perustason SEO/metatietotarkistuksen, ennen/jälkeen-yhteenvedon sekä yhden kootun korjauskierroksen." },
      { question: "Mitä palvelu ei sisällä?", answer: "Palvelu ei sisällä kokonaan uutta verkkosivustoa, laajaa brändiuudistusta, CRM-projektia, maksettua mainontaa, jatkuvaa SEO-työtä, rajattomia sivuja tai rajattomia revisioita. Mahdolliset lisätyöt sovitaan erikseen." },
      { question: "Milloin 72 tuntia alkaa?", answer: "Toimitusaika alkaa, kun maksu, aloituskysely ja toteutukseen tarvittavat käyttöoikeudet tai materiaalit ovat käytettävissä. Asiakkaasta tai kolmannesta osapuolesta johtuva odotus ei kuluta toimitusaikaa." },
      { question: "Tarvitseeko minun ostaa jatkopalvelua?", answer: "Ei. Saat 690 € toimituksen itsenäisenä kokonaisuutena. Jos työn aikana löytyy suurempi mitattava myynnin tai käsittelyn pullonkaula, siitä voidaan tehdä erillinen ehdotus vain erillisellä hyväksynnällä." },
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
