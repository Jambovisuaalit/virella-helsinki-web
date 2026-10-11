# Virella Helsinki — kartoituspyyntöjen toimitus ja ilmoitukset

## Vahvistettu nykytila (11.10.2026)

- Tuotantoon lähetetty sisäinen QA-kartoituspyyntö sai `200 OK` ja `/aloita?kartoitus=1&submitted=1`. Tämä vahvistaa, että Vercel Blob -kirjoitus valmistui onnistuneen vastauksen edellyttämällä tavalla.
- Yksityinen Vercel Blob -tallennus on pysyvä lähde: `contact-leads/production/YYYY-MM-DD/<uuid>.json`.
- Liidit näkyvät ylläpidon `/admin/leads`-näkymässä kirjautumisen jälkeen. Näkymä rajoittuu 100 tallenteeseen.
- Aiempi funktio `sendAdminNotification` **ei lähettänyt sähköpostia**. Uusi koodi voi lähettää Resend-ilmoituksen vain, kun tarvittava lähettäjä ja API-avain on määritetty.
- **Kahden arkipäivän kartoitusraporttia ei muodosteta tai lähetetä automaattisesti.** Se tehdään ja toimitetaan asiakkaalle erikseen.

## Toimintatapa siihen asti, että sähköposti-ilmoitukset on vahvistettu

1. Avaa jokaisena arkipäivänä `/admin/leads` ja tarkista uudet `Maksuton näkyvyyskartoitus` -pyynnöt.
2. Tunnista sisäinen QA-testipyyntö merkinnästä `QA-TUNNISTE`; älä käsittele sitä asiakastoimeksiantona.
3. Tarkista asiakkaan sivusto, paikallinen Google-näkyvyys ja yhteydenottopolku.
4. Toimita kolme priorisoitua korjausehdotusta perusteluineen kahdessa arkipäivässä vastaanotosta.
5. Säilytä varsinainen toteutustarjous erillisenä, asiakkaan hyväksyttävänä päätöksenä.

## Resend-sähköposti-ilmoituksen käyttöönotto

1. Lisää Resendiin **Virellan oma** lähetysverkkotunnus tai asianmukainen aliverkkotunnus ja vahvista sen DNS-tiedot. Älä käytä toisten yritysten lähetysverkkotunnuksia.
2. Määritä Vercelin **Production**-ympäristöön salaisuuksina:
   - `RESEND_API_KEY`: lähettämiseen rajoitettu API-avain.
   - `VIRELLA_NOTIFICATION_FROM`: varmennetun Virella-verkkotunnuksen lähettäjä, esim. `Virella Helsinki <ilmoitukset@virellahelsinki.com>` **vasta, kun lähettäjä on vahvistettu**.
3. Julkaise ympäristömuutokset ja lähetä uusi sisäinen, selvästi QA-merkinnällä varustettu testipyyntö.
4. Varmista erikseen: (a) onnistunut tallennus, (b) sähköpostipalvelun hyväksyntä ja (c) ilmoituksen saapuminen oikeaan postilaatikkoon. Resendin hyväksytty API-vastaus ei yksin takaa viestin perillemenoa.

**Tietoturva:** API-avainta ei lisätä GitHubiin, dokumentaatioon, lomakekoodiin tai selaimeen. Koodin varoitusviestit eivät sisällä yhteydenoton henkilö- tai yritystietoja.

## Virhekäyttäytyminen

- **Blob-tallennus epäonnistuu:** API palauttaa 503, eikä sivu näytä lähetyksen onnistumista.
- **Blob-tallennus onnistuu, mutta sähköposti puuttuu/epäonnistuu:** API palauttaa onnistumisen, koska pyyntö on turvassa. Ylläpidon on silti tarkistettava uudet pyynnöt manuaalisesti.
- **QA-testitallenne:** pysyy yksityisessä tuotantovarastossa, kunnes se poistetaan ylläpidollisesti. Sitä ei saa käsitellä aidoksi asiakasliidiksi.
