import type { Metadata } from "next";
import Image from "next/image";
import { SectionContainer } from "@/components/layout/section-container";
import { SocialPricingCard } from "@/components/marketing/social-pricing-card";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ButtonLink } from "@/components/ui/button";
import { businessConfig } from "@/config/business";
import { products } from "@/config/products";
import { seoConfig } from "@/config/seo";

const euro = new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export const metadata: Metadata = {
  title: { absolute: seoConfig.defaultTitle },
  description: seoConfig.defaultDescription,
  alternates: { canonical: "/" },
  openGraph: { title: seoConfig.defaultTitle, description: seoConfig.defaultDescription, url: "/", siteName: businessConfig.brandName, locale: "fi_FI", type: "website" },
  twitter: { card: "summary", title: seoConfig.defaultTitle, description: seoConfig.defaultDescription },
};

const steps = [
  { number: "01", title: "Sinä kerrot yrityksestäsi.", text: "Valitse Instagram + Facebook -paketti tai LinkedIn-palvelu. Toimita lähtötiedot, olemassa olevat kuvat ja tarvittavat käyttöoikeudet. Sovimme tavoitteet ja sisällön suunnan." },
  { number: "02", title: "Me teemme sisällöt.", text: "Virella suunnittelee aiheet, kirjoittaa tekstit ja toteuttaa julkaisut. Saat sisällöt tarkistettavaksi ja hyväksyt ne ennen julkaisua." },
  { number: "03", title: "Markkinointi pyörii.", text: "Hoidamme julkaisun sovitun suunnitelman mukaan ja kokoamme kuukausiraportin. Sinä keskityt asiakkaisiisi ja yrityksesi arkeen." },
] as const;

export default function Home() {
  const product = products.instagram;
  return (
    <div className="landing-page">
      <a className="landing-skip-link" href="#main-content">Siirry sisältöön</a>
      <SiteHeader landing />
      <main id="main-content">
        <section className="landing-hero" aria-labelledby="hero-title">
          <SectionContainer>
            <p className="landing-eyebrow">Instagram + Facebook & LinkedIn yrityksille</p>
            <h1 id="hero-title">Markkinointi valmiina.<br /><span>Sinä keskityt bisnekseen.</span></h1>
            <p className="landing-lead">Ulkoista sisältösuunnittelu, tuotanto ja julkaisu Virella Helsingille. Saat säännöllisen somenäkyvyyden ilman omaa markkinointitiimiä.</p>
            <ButtonLink href="#hinnoittelu" className="landing-primary">Valitse palvelu</ButtonLink>
            <p className="landing-hero-price">{euro.format(product.price)} / kk <span aria-hidden="true">·</span> {product.commitmentMonths} kk minimi</p>
            <a href="#prosessi" className="landing-text-link">Näin hands-free toimii</a>
            <div className="landing-deliverables" aria-label="Palvelun kokonaisuus"><span>Sisältösuunnittelu</span><span>Tuotanto</span><span>Julkaisu</span><span>Kuukausiraportti</span></div>
          </SectionContainer>
        </section>
        <section id="prosessi" className="landing-process" aria-labelledby="process-title">
          <SectionContainer>
            <div className="landing-section-intro"><div><p className="landing-eyebrow">Näin se toimii</p><h2 id="process-title">Yksi asia vähemmän<br />hoidettavana.</h2></div><p>Hands-free ei tarkoita, että katoat prosessista. Sinä tunnet yrityksesi. Me muutamme sen osaamisen valmiiksi sisällöksi.</p></div>
            <ol className="landing-steps">{steps.map((step) => <li key={step.number}><span className="landing-step-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
            <p className="landing-process-note">Sinun osuutesi: lähtötiedot, materiaalit ja hyväksyntä. Virellan osuus: suunnittelu, toteutus, julkaisu ja seuranta.</p>
          </SectionContainer>
        </section>
        <section className="landing-process" aria-labelledby="samples-title">
          <SectionContainer>
            <div className="landing-section-intro">
              <div><p className="landing-eyebrow">Työnäytteet · YOB Group</p><h2 id="samples-title">Työmaakuvista<br />valmiiksi sisällöksi.</h2></div>
              <p>Kolme työnäytettä YOB Groupille tuotetusta sisältöpaketista. Näytteet havainnollistavat kuvien ja tekstien toteutusta; ne eivät ole lupaus näkyvyydestä tai myyntituloksista.</p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                { id: "01", title: "Injektointi · Forssa", text: "Kohteen työ ja sijainti esiin selkeällä otsikolla ja aidolla työmaakuvalla." },
                { id: "02", title: "Parvekelattioiden pinnoitus", text: "Valmis työnjälki esiin. Yrityksen tunnisteet ja yhteystiedot osaksi julkaisua." },
                { id: "08", title: "Väestönsuojien kunnostus", text: "Konkreettinen palvelu asiakkaan kuvamateriaalista yhtenäiseen julkaisupohjaan." },
              ].map((sample) => (
                <figure key={sample.id} className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface">
                  <Image src={`/images/work-samples/yob-${sample.id}.webp`} alt={`YOB Groupin sisältönäyte: ${sample.title}`} width={900} height={1125} sizes="(max-width: 767px) 100vw, 33vw" className="h-auto w-full" />
                  <figcaption className="p-5"><h3 className="text-lg font-bold">{sample.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{sample.text}</p></figcaption>
                </figure>
              ))}
            </div>
          </SectionContainer>
        </section>
        <section id="hinnoittelu" className="landing-pricing" aria-labelledby="pricing-title">
          <SectionContainer className="landing-pricing-layout">
            <div className="landing-pricing-copy">
              <p className="landing-eyebrow">Selkeä hinta. Selkeä sisältö.</p>
              <h2 id="pricing-title">Oma sisältötiimi.<br /><span>Ilman rekrytointia.</span></h2>
              <p>Valitse yrityksellesi sopiva kanava. Instagram + Facebook näyttävät tekemisesi. LinkedIn tuo asiantuntemuksesi esiin.</p>
              <p>Yksi palvelu, sovittu julkaisurytmi ja kuukausittainen raportti. Näet etukäteen, mistä maksat.</p>
            </div>
            <SocialPricingCard />
            <div className="landing-faq">
                <details><summary>Kuuluvatko molemmat kanavat hintaan?</summary><p>Instagram-paketti sisältää Instagramin ja Facebookin. LinkedIn on erillinen palvelu, eikä kuulu Instagram-paketin hintaan.</p></details>
                <details><summary>Kuinka pitkä sopimus on?</summary><p>Minimisopimus on {product.commitmentMonths} kuukautta. Hinta on {euro.format(product.price)} kuukaudessa, yhteensä {euro.format(product.totalPrice)}. Maksutapa ja jatkon ehdot vahvistetaan ennen aloitusta.</p></details>
                <details><summary>Mitä minulta tarvitaan?</summary><p>Yrityksen lähtötiedot, käytettävissä olevat kuva- ja videomateriaalit sekä julkaisun vaatimat käyttöoikeudet. Tarkistat ja hyväksyt sisällöt ennen julkaisua.</p></details>
                <details><summary>Miten tuloksia seurataan?</summary><p>Saat kuukausiraportin valitun kanavan näkyvyydestä ja sisältöjen toimivuudesta. Sisältöä kehitetään havaintojen perusteella. Tiettyä seuraaja-, yhteydenotto- tai myyntimäärää ei luvata.</p></details>
            </div>
          </SectionContainer>
        </section>
        <section id="yhteys" className="landing-contact" aria-labelledby="contact-title">
          <SectionContainer className="landing-contact-layout"><div><p className="landing-eyebrow">Virella Helsinki</p><h2 id="contact-title">Jätetään markkinointi<br />pois tehtävälistaltasi.</h2><p>Valitse palvelu tai kysy Jamilta, kumpi palvelu sopii yrityksellesi.</p></div><div className="landing-contact-actions"><ButtonLink href="#hinnoittelu" className="landing-primary">Valitse palvelu</ButtonLink><a href={`tel:${businessConfig.phoneE164}`}>{businessConfig.phone}</a></div></SectionContainer>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
