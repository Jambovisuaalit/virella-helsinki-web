# AGENTS.md — Virella Helsinki

## 1. Agentin rooli

Toimit Virella Helsingin autonomisena senior web developerina, UI/UX-suunnittelijana ja teknisenä toteuttajana.

Tehtäväsi on rakentaa tuotantovalmis, nopea, responsiivinen ja konversio-optimoitu verkkosivusto tämän dokumentin sääntöjen mukaisesti.

Älä muuta yrityksen liiketoimintatietoja, tuotteita, hintoja, sopimusehtoja, verotekstejä tai brändiä ilman erillistä ohjetta.

Tärkein periaate:

> Inspect first. Reuse before creating. Keep one source of truth.

---

# 2. GitHub ja deployment

Canonical repository:

`Jambovisuaalit/virella-helsinki-web`

Tämän repon tulee olla ainoa source of truth.

Branchit:

- `develop` = aktiivinen kehitys ja Vercel Preview
- `main` = tuotantoversio
- feature-branchit = yksittäiset suuremmat muutokset

Normaali workflow:

`feature/*`
→ `develop`
→ Vercel Preview
→ testaus
→ `main`
→ Production

ÄLÄ:

- käytä `vido-social/virella-helsinki-web`-repoa aktiiviseen kehitykseen
- muuta production-domainia ilman erillistä lupaa
- liitä `virellahelsinki.com` uuteen Vercel-projektiin ilman erillistä käskyä
- force pushaa `main`-haaraan
- poista vanhaa deploymentia ennen uuden version toimivuuden varmistamista

Kaikki Preview-versiot:

`noindex, nofollow`

Kun tuotantodomain joskus hyväksytään erikseen, production voidaan vaihtaa:

`index, follow`

---

# 3. Tekninen stack

Käytä ensisijaisesti:

- Next.js, latest stable
- App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui vain silloin, kun se aidosti nopeuttaa laadukasta toteutusta
- Lucide Icons yhtenäiseen ikonografiaan
- Vercel
- Stripe maksamiseen
- Supabase tarvittaessa dataan/authiin
- Resend sähköposteihin

Suosi Server Components -komponentteja.

Käytä `"use client"` vain silloin, kun komponentti todella tarvitsee:

- statea
- browser API:a
- event-driven client interactionia
- client-side libraryä

Älä muuta koko sivua client componentiksi vain yhden interaktiivisen elementin vuoksi.

---

# 4. Projektin kansiorakenne

Tavoiterakenne:

```text
virella-helsinki-web/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── palvelut/
│   │   └── page.tsx
│   │
│   ├── instagram/
│   │   └── page.tsx
│   │
│   ├── linkedin/
│   │   └── page.tsx
│   │
│   ├── landing-page-seo/
│   │   └── page.tsx
│   │
│   ├── lvi/
│   │   └── page.tsx
│   │
│   ├── ota-yhteytta/
│   │   └── page.tsx
│   │
│   ├── alkukysely/
│   │   └── page.tsx
│   │
│   ├── checkout/
│   │   └── success/
│   │       └── page.tsx
│   │
│   ├── privacy/
│   │   └── page.tsx
│   │
│   ├── terms/
│   │   └── page.tsx
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   └── login/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── health/
│   │   │   └── route.ts
│   │   └── checkout/
│   │       └── route.ts
│   │
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── brand/
│   │   ├── Logo.tsx
│   │   ├── Wordmark.tsx
│   │   └── BrandMark.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── Container.tsx
│   │
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── ProcessSteps.tsx
│   │   ├── TrustSection.tsx
│   │   ├── FAQ.tsx
│   │   ├── FinalCTA.tsx
│   │   └── MobilePurchaseBar.tsx
│   │
│   ├── commerce/
│   │   ├── BuyButton.tsx
│   │   ├── PriceDisplay.tsx
│   │   └── CheckoutButton.tsx
│   │
│   ├── forms/
│   │   ├── ContactForm.tsx
│   │   └── QuestionnaireForm.tsx
│   │
│   └── ui/
│       └── shared primitive components
│
├── config/
│   ├── brand.ts
│   ├── business.ts
│   ├── products.ts
│   ├── tax.ts
│   ├── navigation.ts
│   └── seo.ts
│
├── content/
│   ├── fi/
│   │   ├── homepage.ts
│   │   ├── instagram.ts
│   │   ├── linkedin.ts
│   │   ├── landing-page-seo.ts
│   │   └── lvi.ts
│   └── en/
│
├── lib/
│   ├── stripe/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── analytics/
│   │   └── events.ts
│   └── utils.ts
│
├── public/
│   ├── brand/
│   │   ├── logo.svg
│   │   ├── wordmark.svg
│   │   └── favicon.svg
│   ├── images/
│   │   ├── homepage/
│   │   ├── instagram/
│   │   ├── linkedin/
│   │   ├── landing-page/
│   │   └── lvi/
│   └── og/
│
├── types/
│   ├── product.ts
│   └── content.ts
│
├── AGENTS.md
├── PROJECT_CONTEXT.md
├── README.md
├── .env.example
└── package.json
```

Älä tee tarpeettoman syvää kansiorakennetta.

Jos komponenttia käytetään vain yhdellä sivulla eikä sille ole realistista uudelleenkäyttöä, sitä ei tarvitse abstrahoida väkisin.

---

# 5. Business DNA

Brändi:

**Virella Helsinki**

Positionointi:

> Markkinointi valmiina palveluna.

Tukiviesti:

> Ulkoista markkinointi. Pidä fokus liiketoiminnassa.

Virella yhdistää:

**ihmisen tekemän palvelun laadun**
+
**digitaalisen tuotteen selkeyden**

Kohderyhmä:

- suomalaiset yrittäjät
- yksinyrittäjät
- pk-yritykset
- B2B-palveluyritykset
- asiantuntijayritykset
- yritykset ilman omaa markkinointitiimiä
- LVI ja muut käytännön palvelualat

Asiakkaan keskeinen ongelma:

> Markkinointia pitäisi tehdä, mutta siihen ei ole aikaa.

Emotionaalinen hyöty:

> Yksi asia vähemmän hoidettavana.

---

# 6. Tone of Voice

Virella puhuu:

- selkeästi
- suoraan
- rauhallisesti
- ammattimaisesti
- konkreettisesti
- helposti lähestyttävästi

Kirjoita kuten hyvin suunniteltu digitaalinen palvelu.

Älä kirjoita kuten perinteinen mainostoimisto.

Hyvä:

> Instagram-markkinointi 490 €/kk.
> Näet ennen ostamista, mitä palveluun kuuluu.

Hyvä:

> Valitse palvelu, maksa verkossa ja täytä aloituskysely.

Huono:

> Mullistamme digitaalisen presenssisi innovatiivisella 360° kasvustrategialla.

Vältä:

- agency-jargonia
- tekoälymäistä korulauseita
- liiallista hypeä
- fake urgencyä
- turhia huutomerkkejä
- tekaistuja referenssejä
- tekaistuja tuloksia
- kasvulupauksia, joita ei voida todistaa

Älä lupaa:

- tiettyä seuraajamäärää
- tiettyä liidimäärää
- tiettyä myyntitulosta
- Google-rankingia
- viraaliksi menemistä

---

# 7. Visuaalinen design system

Visuaalinen suunta:

> Modern Nordic B2B

Brändin tulee näyttää:

- modernilta
- minimalistiselta
- teknisesti viimeistellyltä
- luotettavalta
- rauhalliselta
- premiumilta ilman luksusbrändin jäykkyyttä

Ei:

- geneeristä agency-designia
- neonvärejä
- raskaita gradientteja
- lasimorfismia kaikkialla
- massiivista 3D-grafiikkaa
- turhaa koristelua

---

# 8. Värit

Primary / Virella Teal:

`#135B6C`

Käyttö:

- brändielementit
- vahvat pinnat
- linkit
- sekundääriset CTA:t
- ikonit
- navigaatio

Accent / Coral:

`#EE522B`

Käyttö:

- tärkeä CTA
- ostopiste
- pieni strateginen korostus

Älä käytä Coralia koristevärinä kaikkialla.

Warm Canvas:

`#FCFAF8`

Sivuston ensisijainen tausta.

Ink:

`#1F242E`

Otsikot ja pääteksti.

White:

`#FFFFFF`

Kortit ja kontrastipinnat.

Cloud:

`#EDF0F3`

Vaihtoehtoinen section-tausta.

Mist:

`#E8EBEE`

Hillityt taustat.

Slate:

`#676F7E`

Toissijainen teksti.

Border:

`#DAE0E7`

Korttien ja inputien reunat.

Success:

`#21C45D`

Onnistumistilat.

Brändisääntö:

> Teal = brändi
> Coral = toiminta
> Warm Canvas = tila
> Ink = sisältö

---

# 9. Typografia

Pääfontti:

`Inter`

Käytä Next.js `next/font` -toteutusta.

Älä lataa Google Fonts -CSS:ää ulkoisesti, jos Next Font voidaan käyttää.

Painot:

- 400 body
- 500 emphasis
- 600 buttons / small headings
- 700 headings
- 800 hero / prices

Desktop-suositukset:

Hero H1:
`56–64px / 1.0–1.08`

H1:
`48–56px`

H2:
`34–40px`

H3:
`22–26px`

Lead:
`18–20px`

Body:
`16–18px`

Small:
`14px`

Mobile:

Hero:
`38–44px`

H2:
`28–32px`

Body:
`16px`

Älä käytä liian pitkiä tekstirivejä.

Suositeltu tekstileveys:

`max-width: 680–760px`

---

# 10. Logo

Brändin ensisijainen logo on typografinen wordmark.

Suunta:

- moderni
- tech-henkinen
- bold
- minimalistinen
- mustavalkoinen versio aina saatavilla

Logo ei tarvitse erillistä symbolia pakollisesti.

SVG-logo tallennetaan:

`/public/brand/logo.svg`

ja tarvittaessa:

`logo-black.svg`
`logo-white.svg`

Älä generoi logoa CSS-tekstinä, jos virallinen SVG on olemassa.

---

# 11. Layout

Global container:

```tsx
max-w-[1152px] mx-auto px-4 sm:px-6 lg:px-8
```

Section spacing:

Mobile:
`py-16`

Desktop:
`md:py-24`

Hero saa tarvittaessa enemmän tilaa.

Perusradius:

`12px`

Suuremmat hero/CTA-pinnat voivat käyttää:

`20px`

Älä tee kaikesta pill-muotoista.

---

# 12. Kortit

Peruskortti:

- background white
- border `#DAE0E7`
- radius 12px
- erittäin kevyt varjo
- riittävä sisäinen whitespace

Shadow:

```css
0 8px 40px -12px rgba(31, 36, 46, 0.12)
```

Hover:

- pieni translateY
- maltillinen shadow enhancement
- ei suurta skaalausta

---

# 13. CTA-painikkeet

Primary CTA:

- selkeä
- korkea kontrasti
- yksi vahva CTA per näkymä
- action-oriented label

Esimerkkejä:

`Katso palvelut`
`Osta nyt`
`Aloita Instagram-palvelu`
`Aloita LinkedIn-palvelu`
`Tilaa landing page`

Secondary CTA:

- outline
- ghost
- text link

Vältä geneeristä:

`Lue lisää`

jos voidaan kirjoittaa:

`Tutustu Instagram-palveluun`

---

# 14. Kuvamaailma

Käytä ensisijaisesti:

- oikeita yrittäjiä
- suomalaisia työympäristöjä
- aitoa työskentelyä
- asiantuntijoita
- projekteja
- työmaita
- tuotteita ja palveluita käytännössä
- luonnollista valoa
- pohjoismaista ympäristöä

Tyyli:

> Editorial documentary + Nordic business

Älä käytä:

- geneerisiä "happy business team around laptop" -stock-kuvia
- neon-social-media-kuvia
- epärealistisia AI-ihmisiä
- liian poseerattuja yrityskuvia

LVI-kuvissa:

- asentajat
- työmaat
- tekniset tilat
- asennukset
- valmis työnjälki
- kalusto
- ihmiset työssä

---

# 15. Julkiset reitit

Indexoitavat markkinointisivut:

```text
/
/palvelut
/instagram
/linkedin
/landing-page-seo
/lvi
/ota-yhteytta
```

Utility-sivut:

```text
/alkukysely
/checkout/success
/privacy
/terms
/admin
/admin/login
```

Utility/admin-sivuja ei optimoida hakukoneiden landing pageiksi.

---

# 16. Homepage-rakenne

Etusivun järjestys:

```text
Header
↓
Hero
↓
Arvolupaus / ongelmanratkaisu
↓
Palvelut
↓
Miten se toimii
↓
Kenelle palvelu sopii
↓
Miksi Virella
↓
Luottamussignaalit
↓
FAQ
↓
Final CTA
↓
Footer
```

Älä lisää tekaistua testimonial-sectionia.

---

# 17. Tuotteet — SINGLE SOURCE OF TRUTH

Kaikki hinnat tulevat:

`config/products.ts`

Esimerkki:

```ts
export const products = {
  instagram: {
    id: "instagram",
    name: "Instagram 3 kk -kampanja",
    price: 490,
    billing: "month",
    commitmentMonths: 3,
    totalPrice: 1470,
  },

  linkedin: {
    id: "linkedin",
    name: "LinkedIn Starttipaketti",
    price: 490,
    billing: "month",
    commitmentMonths: 3,
    totalPrice: 1470,
  },

  landingPageSeo: {
    id: "landing-page-seo",
    name: "Landing Page + SEO",
    price: 390,
    billing: "one_time",
  },
} as const;
```

ÄLÄ kirjoita numeroita:

`490`
`390`
`1470`

suoraan satunnaisiin UI-komponentteihin.

UI hakee ne aina configista.

---

# 18. Tuotteiden sisällöt

Instagram:

- 490 €/kk
- 3 kk
- yhteensä 1 470 €
- 12–25 feed-julkaisua / kk
- viikoittaiset Stories
- Reels / lyhytvideot
- sisältösuunnittelu
- hashtag-strategia
- kommenttien hallinta
- kuukausiraportointi ja analytiikka

LinkedIn:

- 490 €/kk
- 3 kk
- yhteensä 1 470 €
- 4–8 julkaisua / kk
- sisältöstrategia
- profiilin optimointi
- kuukausiraportointi

Landing Page + SEO:

- 390 €
- kertamaksu
- responsiivinen landing page
- on-page SEO
- suorituskyvyn optimointi
- analytiikan integrointi

---

# 19. Verotus / VAT

Verotukseen liittyvä teksti EI saa olla hajautettuna komponentteihin.

Käytä:

`config/tax.ts`

Esimerkki:

```ts
export const taxConfig = {
  vatRegistered: false,
  publicMessage:
    "Hintoihin ei lisätä arvonlisäveroa. Myyjä ei ole ALV-rekisterissä.",
};
```

Älä käytä automaattisesti tekstiä:

`ALV 0 %`

jos yritys ei ole ALV-rekisterissä.

Verotustieto on pystyttävä muuttamaan yhdestä paikasta koko palveluun.

---

# 20. Yritystiedot

Käytä:

`config/business.ts`

Esimerkki:

```ts
export const business = {
  brandName: "Virella Helsinki",
  legalName: "Tmi Harju Jami",
  businessId: "3581581-6",
  city: "Helsinki",
  country: "Finland",
  email: "hello@virellahelsinki.com",
};
```

Älä kopioi Y-tunnusta, sähköpostia tai juridista nimeä kymmeniin komponentteihin.

---

# 21. Mobile-first

Kaikki sivut suunnitellaan ensin 320 px leveälle näytölle.

Testaa vähintään:

```text
320
360
375
390
430
768
1024
1280
1440
```

Ei horizontal overflowta.

CTA-painikkeiden tulee toimia peukalolla.

Teksti ei saa olla liian pientä.

---

# 22. Mobile Purchase Bar

Palvelusivuilla:

- `/instagram`
- `/linkedin`
- `/landing-page-seo`
- `/lvi`

käytetään mobiilin sticky purchase baria.

Rakenne:

```text
[ Palvelu + hinta ]        [ Osta nyt ]
```

Vain mobile:

`md:hidden`

Huomioi:

`env(safe-area-inset-bottom)`

Sivun sisältöön lisätään tarpeeksi bottom paddingia, jotta bar ei peitä sisältöä.

Desktopilla sticky bottom baria ei näytetä.

---

# 23. SEO

SEO-kriittinen sisältö pitää olla server-rendered HTML:ssä.

Älä rakenna SEO-sivuja tyhjän client shellin sisälle.

Jokaisella julkisella palvelusivulla:

- unique title
- unique description
- canonical
- Open Graph
- Twitter metadata
- H1 vain yksi
- looginen H2/H3-hierarkia
- structured data tarvittaessa

Esimerkit:

Instagram:

`Instagram-markkinointi yrityksille | Virella Helsinki`

LinkedIn:

`LinkedIn-markkinointi yrityksille | Virella Helsinki`

LVI:

`Instagram-markkinointi LVI-yrityksille | Virella Helsinki`

Palvelut:

`Instagram, LinkedIn & SEO-palvelut yrityksille | Virella Helsinki`

---

# 24. Robots ja sitemap

Preview:

```text
noindex, nofollow
```

Productionia ei saa vaihtaa indeksoitavaksi ilman erillistä hyväksyntää.

Sitemapissa pidä vain indexoitaviksi tarkoitetut julkiset sivut.

Älä lisää fake `lastModified` -päivämääriä vain siksi, että build tapahtui tänään.

---

# 25. Accessibility

Tavoite:

WCAG 2.1 AA.

Varmista:

- semanttinen HTML
- keyboard navigation
- näkyvät focus states
- label jokaiselle form-kentälle
- alt-tekstit oikeille kuville
- aria-label vain tarvittaessa
- button on button
- link on link
- oikea heading hierarchy
- riittävä kontrasti

Huom:

`#EE522B` + pieni valkoinen teksti ei välttämättä täytä normaalia WCAG AA -kontrastia.

Tarkista kontrasti ennen CTA:n lopullista käyttöä.

Tarvittaessa käytä tummempaa Coral-versiota.

---

# 26. Motion

Motion on hienovaraista.

Suositus:

- fade
- 10–20 px translate
- 300–600 ms
- ease-out

Ei:

- scroll hijacking
- jatkuvaa liikettä
- raskasta parallaxia
- flashy entrance effects

Kunnioita:

`prefers-reduced-motion`

---

# 27. Performance

Pidä sivusto erittäin nopeana.

Tavoite Lighthouse:

Performance ≥ 90

Accessibility ≥ 95

SEO ≥ 95

Best Practices ≥ 95

Käytä:

- `next/image`
- oikeita image sizes
- WebP/AVIF
- lazy loading below fold
- font optimization
- mahdollisimman vähän client JS:ää

Älä lisää raskaita animation libraryjä ilman perustelua.

---

# 28. Stripe

Stripe-integraatiossa:

- aloita test mode -ympäristöllä
- älä luo uusia live-tuotteita sokkona
- tarkista nykyinen Stripe-konfiguraatio ensin
- käytä server routea Checkout Sessionin luomiseen
- älä koskaan expose secret keytä clienttiin

Client:

`NEXT_PUBLIC_*`

vain aidosti julkisille arvoille.

Secretit pysyvät Vercel Environment Variables -asetuksissa.

---

# 29. Supabase

Jos Supabasea käytetään:

- RLS aina päälle asiakasdataan
- service role key ei koskaan browseriin
- käytä server-side clientia sensitiivisiin operaatioihin
- tarkista nykyinen schema ennen migrationeita
- älä tuhoa olemassa olevaa dataa

---

# 30. Analytics

Käytä selkeitä eventtejä.

Esimerkkejä:

```text
page_view
service_view
purchase_click
checkout_started
checkout_success
questionnaire_started
questionnaire_completed
contact_submit
```

Älä lähetä analyticsiin:

- asiakkaan vapaita tekstivastauksia
- henkilötietoja
- sähköpostiosoitteita
- muuta tarpeetonta sensitiivistä dataa

---

# 31. Lomakkeet

Kaikissa lomakkeissa:

- client validation
- server validation
- loading state
- success state
- error state
- accessible labels

Älä käytä pelkkää placeholderia labelina.

---

# 32. Error handling

Käyttäjä ei saa nähdä:

- stack tracea
- API keytä
- raw database erroria
- Stripe internalsia

Käyttäjälle:

> Jokin meni pieleen. Yritä uudelleen tai ota yhteyttä.

Tekninen virhe voidaan logata serverillä.

---

# 33. Turvallisuus

Älä koskaan committaa:

```text
.env
.env.local
Stripe secret key
Supabase service role key
API secrets
access tokens
private credentials
```

`.env.example` sisältää vain nimet:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
```

Ei oikeita arvoja.

---

# 34. Code quality

TypeScript strict.

Vältä:

`any`

ellei sille ole erittäin hyvää syytä.

Pidä:

- komponentit pieninä
- nimet kuvaavina
- propsit tyypitettyinä
- datarakenteet configissa
- UI-logiikka komponenteissa
- integraatiot lib-kansiossa

Älä tee samaa logiikkaa useaan paikkaan.

DRY, mutta älä yliabstrahoi.

---

# 35. Ennen uuden koodin kirjoittamista

Agentin tulee aina:

1. lukea `AGENTS.md`
2. lukea `PROJECT_CONTEXT.md`
3. tarkistaa nykyinen Git branch
4. tarkistaa olemassa oleva toteutus
5. etsiä, onko vastaava komponentti jo olemassa
6. tarkistaa config ennen business-datan lisäämistä
7. tehdä mahdollisimman pieni, hallittu muutos

Älä kirjoita olemassa olevaa toimivaa rakennetta uusiksi ilman perusteltua syytä.

---

# 36. Jokaisen muutoksen jälkeen

Aja vähintään:

```bash
npm run lint
npm run typecheck
npm run build
```

Jos `typecheck` scriptiä ei ole:

```bash
npx tsc --noEmit
```

Korjaa virheet ennen commitia.

Älä committaa rikkinäistä buildia.

---

# 37. Git commitit

Pidä commitit pieninä ja ymmärrettävinä.

Esimerkkejä:

```text
feat: add homepage service section

feat: implement instagram landing page

feat: add centralized product configuration

fix: correct mobile purchase bar spacing

fix: prevent preview deployment indexing

refactor: move business data to shared config

style: refine homepage responsive spacing

seo: add metadata for linkedin service page
```

Älä käytä:

`update stuff`

`changes`

`fix things`

---

# 38. Sisältötarkastus ennen releasea

Ennen tuotantoon vientiä etsi koko reposta ainakin:

```text
1500
VAT 0
ALV 0
490
390
1470
testimonial
review
guaranteed
guarantee
followers
leads
sales
ranking
```

Tarkoitus:

- löytää vanhat hinnat
- löytää väärä veroteksti
- estää tekaistut arvostelut
- löytää perusteettomat tuloslupaukset
- varmistaa keskitetty pricing

---

# 39. UX-pääperiaate

Jokaisen markkinointisivun tulee vastata nopeasti kolmeen kysymykseen:

> Mitä tämä on?

> Mitä saan ja mitä se maksaa?

> Mitä teen seuraavaksi?

Jos käyttäjän pitää etsiä hinta, palvelun sisältö tai CTA, layout ei ole valmis.

---

# 40. Brändin lopullinen design-sääntö

Kun logo poistetaan sivulta, käyttöliittymän pitäisi silti näyttää Virellalta.

Sen pitää sisältää:

- Warm Canvas -pohja
- vahva moderni typografia
- Virella Teal
- harkittu Coral
- selkeät kortit
- runsaasti whitespacea
- aito B2B-kuvamaailma
- yksi selkeä toimintakehotus

Ohjenuora:

> Näytä oikea työ.
> Pidä design yksinkertaisena.
> Tee viestistä päähenkilö.

---

# 41. Autonomisen agentin toimintatapa

Kun saat uuden tehtävän:

PHASE A — Inspect

Tutki nykyinen koodi ja rakenne.

PHASE B — Plan

Kirjoita lyhyesti mitä aiot muuttaa ja mitkä tiedostot kosketat.

PHASE C — Implement

Tee muutos mahdollisimman pienellä diffillä.

PHASE D — Verify

Aja lint, typecheck ja build.

PHASE E — Review

Tarkista mobiili, desktop, accessibility ja business facts.

PHASE F — Commit

Tee kuvaava commit.

PHASE G — Report

Raportoi:

- mitä muutettiin
- mitä tiedostoja muutettiin
- testien tulos
- commit hash
- mahdollinen Preview URL
- avoimet riskit

Älä siirry seuraavaan suureen vaiheeseen automaattisesti, jos tehtävä oli rajattu yhteen vaiheeseen.

---

# 42. Definition of Done

Feature on valmis vasta kun:

- UI noudattaa Virella Business DNA:ta
- toimii 320 px mobiilissa
- toimii desktopilla
- ei horizontal overflowta
- hinta tulee centralized configista
- business facts eivät ole duplikaatteina
- accessibility on huomioitu
- SEO on kunnossa julkisella sivulla
- noindex säilyy Previewssa
- lint PASS
- TypeScript PASS
- build PASS
- salaisuuksia ei ole commitissa
- commit on tehty
- Vercel Preview toimii
