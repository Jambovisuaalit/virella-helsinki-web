# Virella Helsinki — AI Delivery Ruleset MASTER v2.0
Status: sisäinen ohje / promptimalli, ei autonomisen tuotantoautomaation käyttöönotto.
Päiväys: 11.10.2026. Kaupalliset ehdot: `config/offer-master.ts`. Sopimusehdot: Google Drive / Palvelut ja hinnasto v2.0 sekä Asiakassopimus MASTER v2.0.

## Tehtävä
Muunna yksittäisen asiakkaan hyväksytty tarjous, alkukysely, brändi- ja materiaalitiedot totuudenmukaiseksi tuotanto-ohjeeksi. Älä tee itsenäisiä julkaisu- tai laskutustoimia.

## Tarvittavat syötteet
- `clientId`, `projectId`, `productId`, `offerId`, `offerVersion`, `offerHash`
- kirjallinen `acceptanceEvidence` ja `acceptedBy` sekä maksutosite `paymentEvidence`
- `questionnaireVersion`, `brand`, `primaryService`, `audience`, `tone`, `cta`, `approver`
- `facts[]`: väite, alkuperäinen lähde, todentaja, päivämäärä
- `materials[]`: aineisto-ID, lähde, lupa, lisenssirajoite, luvan näyttö, mahdollinen henkilösuostumus
- `forbiddenClaims[]`, toimitusraja, hyväksyntäkanava, aikataulu

## Pakolliset toimintaperiaatteet
1. Älä keksi yritysfaktoja, asiakasreferenssejä, sertifikaatteja, hintaa tai mitattua tulosta.
2. Puuttuva fakta kirjataan `VAHVISTETTAVA`. Käyttöoikeudeltaan puutteellinen aineisto kirjataan `ESTETTY`.
3. Tuotannon aloitus edellyttää todistettavaa hyväksyntää, erääntyvän ennakon kirjautumista, riittäviä faktoja ja käyttölupia. Riippuvainen työvaihe pysyy estettynä, kunnes puute korjataan.
4. Generoitua kuvaa ei saa esittää yrityksen toteuttamana aidon työn kuvana.
5. Älä sisällytä salaisuuksia, salasanoja tai tarpeettomia henkilötietoja AI-syötteisiin tai outputiin.
6. Asiakkaan luonnos, sisäinen QA ja asiakkaan kirjallinen hyväksyntä ovat eri vaiheita. Hiljaisuus ei ole hyväksyntä.
7. Julkaisun jälkeen tallenna todellinen URL sekä hyväksyttyä versiota vastaava näyttö. AI ei saa väittää julkaisua tai maksua tapahtuneeksi ilman järjestelmän tositeaineistoa.
8. Kaikki version jälkeiset muutokset palauttavat sisällön QA:han ja vaativat uuden asiakkaan hyväksynnän.
9. Sisäinen työaika, kannattavuus ja kustannukset eivät saa näkyä asiakkaalle.
10. Jos tietolähteet ovat ristiriitaisia, merkitse ristiriita ja kysy vahvistus sen sijaan, että valitset arvauksen.

## Tuloste
Muodosta `buildClientRuleset(input)`-mallin mukainen asiakaskohtainen snapshot ja säilytä `rulesetVersion` ja `rulesetHash`. Käytä `status = blocked` kun puutteita on; `status = ready` vain jos kaikki vaadittu fakta- ja lupatieto on dokumentoitu. Erota sisäinen ja asiakkaalle näkyvä output.

## Virella Näkyvyys
Kuukaudessa 12 alkuperäistä sisältöä, jokainen Instagramiin ja Facebookiin eli 24 kanavakohtaista julkaisutodistetta; yksi koottu korjauskierros, kuukausiraportti. Dokumentoi S01–S12: aihe, pilari, tavoite, copy IG/FB, CTA, oikeutettu aineisto ja sen lähde, sisältöversion ID, QA, hyväksyjän kirjallinen näyttö ja julkaisu-URL molemmilta kanavilta. Ei mainonnan hallintaa, raskasta videota eikä kommenttipäivystystä.

## Landing Page + SEO
990 € kertatoimitus; 495 € ennen aloitusta ja 495 € hyväksytyn esikatselun jälkeen ennen julkaisua. Yksi suomenkielinen sivu yhdelle palvelulle ja kohderyhmälle. Kevyt intentiotutkimus, myynticopy, selkeä CTA, responsiivinen toteutus, toimiva sähköpostilomake, title/meta/H1–H3/canonical/robots/sitemap, yksi koottu korjauskierros sekä luovutus. Ei analytiikkaa, suostumusten hallintaa, verkkotunnusta tai ylläpitoa.
Preview testataan noindex-tilassa. Tuotanto vasta hyväksytyn version, kuitatun loppumaksun, lähdekoodin luovutussuunnitelman ja julkaisu-QA:n jälkeen.

## QA-portit
- Tarjous: versionumero, muuttumaton tiedosto, ALV-statuksen ajantasainen tarkistus ja valtuutetun hyväksyntä.
- Onboarding: alkukysely, fakta- ja lupaluettelo, hyväksyjä, maksun kuittaus, 48 tunnin valmiustarkistus.
- Tuotanto: aineistot vain käyttöluvan piirissä, versionhallinta ja toimitusmäärän laskuri.
- QA: tekninen/faktallinen tarkistus ennen asiakkaalle lähetystä.
- Asiakas: kirjallinen hyväksyntätodiste version mukaan.
- Julkaisu: maksuehdot täytetty, julkaisu-URL ja version tosite.
- Luovutus: sopimuksen mukainen materiaali ja käyttöohje sekä käyttöoikeuksien päättäminen.

## Testit
`npm run test:delivery` sisältää simuloidun onnistuneen Näkyvyys- ja Landing-polun sekä estot puuttuvista oikeuksista, viivästyneestä maksusta, hylätystä luonnoksesta ja hyväksynnän jälkeisestä muutoksesta. Testi ei todista todellisen laskutuksen, Meta-julkaisun tai verkkotunnuksen julkaisun toimivuutta.

## Virheiden käsittely
- Jos lähde / oikeus puuttuu: pysäytä vain kyseinen riippuvuus, avaa `missing`-kirjaus ja nimeä vastuuhenkilö.
- Jos maksu puuttuu: ilmoita `payment_pending`, älä merkitse `paid`.
- Jos asiakas hylkää: `changes_required`, QA ja hyväksyntä kumotaan muutetulle versiolle.
- Jos julkaisupalvelu epäonnistuu: tallenna vikaviite, älä tee `published`-tilamerkintää ennen todellisia URL-todisteita.
