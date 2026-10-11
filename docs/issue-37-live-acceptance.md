# Issue #37 — jaetun liidiputken live-hyväksyntä

Tämä tarkistus on tehtävä ennen PR #38:n yhdistämistä tuotantohaaraan. Automatisoitu GitHub CI tai Vercelin READY-tila **ei yksin todista** oikeaa Blob-tallennusta eikä kahden selainistunnon käytettävyyttä.

## Ympäristöt

- Käytä vain PR #38:n **viimeisimmän head-SHA:n** Preview-deploymentia. Vanhempi READY-deployment ei korvaa uusimman koodin tarkistusta.
- Preview ja production käyttävät erillisiä polkuja: `contact-leads/preview/` ja `contact-leads/production/`, ja samoin muutostapahtumat `contact-lead-events/{environment}/`.
- Varmista, että Preview'n yksityinen `BLOB_READ_WRITE_TOKEN` osoittaa tarkoitettuun Blob-varastoon. Älä kopioi salaisuuksia dokumentaatioon.
- **Älä** käytä julkaistua `virellahelsinki.com`-lomaketta Preview-hyväksyntään tai luo toistuvia tuotantotestiliidejä.
- Tarkista, että `/admin`, `/admin/leads` ja `/admin/sales` eivät indeksoidu ja vaativat kirjautumisen.

## Hyväksyntätesti A: uusi QA-kartoitus Preview'ssa

1. Luo yksi luvallinen näkyvyyskartoituspyyntö Preview'n lomakkeella. Käytä omia testi-/yritystietoja ja merkitse viestin ensimmäiseksi riviksi `QA-TUNNISTE: sisainen-hyvaksyntatesti`.
2. Varmista, että HTTP-lähetys onnistuu ja tietue löytyy **samalla id:llä** `/admin/leads`- ja `/admin/sales`-näkymistä.
3. Varmista, että `isTest=true`, `monthlyValue=0`, `stage=Leads`, `deliveryStatus=received` ja kahden arkipäivän tehtävän päivämäärä näkyvät.
4. Tarkista myyntimittarit ennen ja jälkeen: aktiivisten liidien, konversioiden, avoimen euromääräisen putken ja MRR:n on pysyttävä ennallaan.
5. Muuta testiliidi `in_review` ja sitten `draft_ready`; tarkista pysyvyys sivun uudelleenlatauksella ja **toisella selaimella tai yksityisellä ikkunalla**, joka on kirjautunut adminina.
6. Avaa sama liidi kahteen selaimeen. Tallenna muutos ensimmäisessä; toisen selaimen vanhan lomakkeen on saatava selkeä vanhentuneen revision virhe eikä se saa ylikirjoittaa ensimmäistä muutosta.

## Hyväksyntätesti B: lähetys ja tietoturva

1. Yritä asettaa `sent` ilman lähetetyn Gmail-viestin linkkiä tai ilman manuaalista vahvistusta: tallennuksen on epäonnistuttava.
2. `sent`-tila edellyttää **oikeasti lähetettyä** viestiä ja adminin linkkiä sekä vahvistusta. Älä lähetä QA-sähköpostia oikealle asiakkaalle vain testin vuoksi. Käytä erillistä hallittua testipostilaatikkoa.
3. Vahvista tapahtumalogista aikaleima, edellinen ja uusi tila sekä admin-toimijan merkintä. Vanhaa alkuperäistä Blob-tallennetta ei saa korvata.
4. Testaa kirjautumaton ja vieraan Originin POST: muutos ei saa onnistua. Varmista, ettei lomakkeen henkilötietoja näy julkisessa repossa tai virhelokeissa.
5. Älä pidä pelkkää Gmail-linkkiä teknisenä Gmail API -toimituskuittauksena: nykyinen mekanismi perustuu adminin manuaaliseen vakuutukseen. Toimituksen tekninen varmennus vaatii erillisen integraation.

## Tuotantoonsiirron jälkeen: vanha sisäinen kartoitustesti

1. Etsi aiemmin tehty sisäinen QA-kartoitus alkuperäisestä production-liidilistasta, **älä luo uutta duplikaattia**. Tämä vaihe tehdään vasta hyväksytyn merge- ja production-julkaisun jälkeen.
2. Vahvista sen `isTest=true`; tarkista, ettei se kasvata liidimääriä tai MRR:ää.
3. Jos varsinainen kartoitus on jo lähetetty sähköpostilla, tarkista lähetetty viesti Gmailin Sent-kansiosta; merkitse `sent` vasta todennetun viestin perusteella.
4. Varmista, että kirjautuneet ylläpitäjät näkevät saman tilan myös toisella laitteella.

## Tunnetut rajaukset ja julkaisupäätös

- Yli **1 000 liidiä** aiheuttaa näkyvän virheen osittaisen KPI:n sijaan. Oikea sivutus/aggregointi tarvitaan ennen rajan täyttymistä.
- Yli **500 tapahtumaa yhdellä liidillä** pysäyttää tilan lukemisen, kunnes tapahtumahistoriaan toteutetaan sivutus.
- Vanhan yhden selaimen `localStorage`-prospektit **eivät siirry automaattisesti** palvelinrekisteriin. Mahdolliset tärkeät vanhat prospektit pitää inventoida ja siirtää hyväksytysti, ettei niitä pidetä poistettuina tai siirrettyinä automaattisesti.
- Kahden arkipäivän oletus huomioi viikonloput, **ei kaikkia Suomen arkipyhiä**. Poikkeuskalenteri vaatii oman korjauksen.
- Optimistinen revisiotarkistus estää vanhentuneen lomakkeen tavallisen ylikirjoituksen, mutta ei tarjoa atomista transaktiota täysin samanaikaisille kirjoituksille.
- Oikean asiakkaan viestiä ei lähetetä uudelleen testiä varten.

Julkaisupäätös: **DRAFT** kunnes viimeisimmän commitin Preview, tallennuksen readback, testien KPI-nollavaikutus sekä kahden selaimen tilatesti ovat PASS.
