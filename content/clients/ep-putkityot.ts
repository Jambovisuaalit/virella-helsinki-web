// Public directory facts checked 2026-10-11. Directory evidence is not owner approval.
export const epPutkityot = {
  slug: "ep-putkityot",
  name: "EP Putkityöt",
  legalName: "EP Putkityöt Tmi",
  businessId: "3184301-9",
  city: "Helsinki",
  phone: "040 216 5855",
  phoneHref: "tel:+358402165855",
  industry: "Putkityöt",
  headline: "Putkityö mielessä? Aloitetaan puhelusta.",
  intro: "Kerro kohteesta ja tarvittavasta työstä. Puhelussa voit selvittää työn sopivuuden ja sopia seuraavasta vaiheesta.",
  callLabel: "Soita ja kysy työstä",
  preparation: [
    { number: "01", title: "Kohde", text: "Missä kohde sijaitsee ja millaisesta tilasta on kyse?" },
    { number: "02", title: "Tarve", text: "Mitä pitäisi tehdä? Kuvaile ongelma tai suunniteltu työ." },
    { number: "03", title: "Aikataulu", text: "Milloin työ olisi ajankohtainen? Kerro myös mahdollisesta kiireestä." },
  ],
  demo: {
    label: "Virella Helsinki · Verkkosivuehdotus",
    notice: "Esittelydemo — ei yrityksen virallinen sivu. Palvelut ja toimialue vahvistetaan yrittäjältä.",
  },
  research: {
    checkedAt: "2026-10-11",
    confidence: "directory-confirmed; owner-unconfirmed",
    sources: [
      { url: "https://www.proff.fi/yrityksen-nimi-haku?q=Putkity%C3%B6t", facts: ["legalName", "businessId", "phone", "industry"] },
      { url: "https://suomenyritysrekisteri.fi/yritysrekisteri/rakentaminen%2Bja%2Bremontointi/lvi-tyot/helsinki/40/", facts: ["legalName", "city"] },
    ],
    registryCheck: "PRH open-data excludes sole traders (https://www.ytj.fi/index/avoindata.html). Active status not verified; empty API result is not evidence of closure.",
    websiteSearch: "No owned website found by exact-name search; absence not confirmed by owner.",
    ownerQuestions: ["Onko toiminta käynnissä ja numero ajantasainen?", "Onko kotisivu eri nimellä?", "Mitkä ovat pääpalvelut, asiakkaat ja toimialue?"],
    omittedClaims: ["24/7", "response time", "prices", "reviews", "years of experience", "credentials", "specific services", "email", "staff count"],
  },
} as const;
