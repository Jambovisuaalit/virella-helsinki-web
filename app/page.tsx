import type { Metadata } from "next";
import Image from "next/image";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { PriceDisplay } from "@/components/ui/price-display";
import { ButtonLink } from "@/components/ui/button";
import { businessConfig } from "@/config/business";
import { seoConfig } from "@/config/seo";
import { homepagePricing } from "@/config/homepage-pricing";
import { taxConfig } from "@/config/tax";

export const metadata: Metadata = {
  title: { absolute: seoConfig.defaultTitle },
  description: seoConfig.defaultDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    url: "/",
    siteName: businessConfig.brandName,
    locale: "fi_FI",
    type: "website",
  },
  twitter: { card: "summary", title: seoConfig.defaultTitle, description: seoConfig.defaultDescription },
};

const services = [
  {
    number: "01",
    name: "Virella Näkyvyys",
    headline: "Työnjälkesi esiin somessa.",
    pricing: homepagePricing.social,
    description: "Toimita kuvat ja lähtötiedot. Me suunnittelemme sisällöt, kirjoitamme tekstit ja hoidamme sovitut julkaisut Instagramiin ja Facebookiin. Hyväksyt sisällöt ennen julkaisua.",
    details: ["Instagram ja Facebook", "12 sisältöä kuukaudessa, jokainen molempiin kanaviin", "Hyväksyntä ennen julkaisua"],
    href: "/sosiaalinen-media",
    action: "Tutustu somepalveluun",
  },
  {
    number: "02",
    name: "Virella Löydettävyys",
    headline: "Google-näkyvyys kuntoon.",
    pricing: homepagePricing.google,
    description: "Autamme kehittämään Google-yritysprofiilia, paikallista hakunäkyvyyttä ja arvostelujen keräämisen käytäntöjä. Tavoitteena on ajantasainen ja luotettava kuva yrityksestäsi.",
    details: ["Google Business Profile", "Paikallinen SEO", "Seuranta ja kehitys"],
    href: "/aloita?kartoitus=1",
    action: "Pyydä maksuton näkyvyyskartoitus",
  },
  {
    number: "03",
    name: "Virella Verkkosivut",
    headline: "Verkkosivut, joilta on helppo ottaa yhteyttä.",
    pricing: homepagePricing.website,
    description: "Landing Page + SEO sisältää yhden myyntisivun, toimivan yhteydenottolomakkeen ja teknisen SEO:n perusteet. Laajemmat verkkosivustot, analytiikka ja ylläpito sovitaan erikseen.",
    details: ["Yksi myyntisivu ja yhteydenottolomake", "Teknisen SEO:n perusteet", "Laajemmat sivustot ja analytiikka erikseen"],
    href: "/aloita",
    action: "Kerro sivustotarpeestasi",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Lähetä verkkosivusi osoite.",
    description: "Kerro yrityksestäsi ja siitä, mihin haluat apua. Jos yritykselläsi ei vielä ole verkkosivuja, jätä erillinen aloituspyyntö.",
  },
  {
    number: "02",
    title: "Saat kolme tärkeintä korjausehdotusta.",
    description: "Käymme läpi julkisen verkkonäkyvyytesi ja yhteydenottopolun. Ehdotukset auttavat valitsemaan tärkeimmän korjauksen.",
  },
  {
    number: "03",
    title: "Valitse, mitä haluat toteuttaa.",
    description: "Jos tarvitset apua korjauksiin, sovimme työn sisällön, hinnan ja aikataulun ennen aloitusta. Kartoitus ei velvoita ostamaan mitään.",
  },
] as const;

export default function Home() {
  return (
    <div className="landing-page min-h-screen">
      <a href="#main-content" className="landing-skip-link">Siirry sisältöön</a>
      <SiteHeader />
      <main id="main-content">
        <section className="virella-photographic-hero relative isolate flex min-h-[650px] items-center overflow-hidden py-20 sm:min-h-[700px] sm:py-28 lg:min-h-[740px] lg:py-32" aria-labelledby="home-title">
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/images/virella-workspace-hero.webp"
              alt=""
              fill
              priority
              unoptimized
              sizes="100vw"
              className="virella-hero-photo object-cover"
            />
            <div className="virella-hero-veil absolute inset-0" />
          </div>
          <SectionContainer className="relative z-10">
            <div className="max-w-[720px]">
              <p className="mb-7 max-w-[520px] text-xs font-semibold uppercase leading-6 tracking-[0.10em] text-brand sm:text-sm">
                Digitaalista näkyvyyttä paikallisille palveluyrityksille
              </p>
              <h1 id="home-title" className="max-w-[720px] text-foreground ui-heading-hero">
                Näytä verkossa, miksi asiakkaan kannattaa{ " "}
                <span className="text-brand">valita sinut.</span>
              </h1>
              <p className="mt-8 max-w-[570px] text-base leading-[1.85] text-foreground/85 sm:mt-9 sm:text-lg">
                Virella Helsinki toteuttaa verkkosivut, Google-näkyvyyden ja somesisällöt paikallisille palveluyrityksille. Teemme osaamisestasi näkyvää ja yhteydenotosta helppoa.
              </p>
              <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
                <ButtonLink href="/aloita?kartoitus=1" className="w-full sm:w-auto">
                  Pyydä maksuton näkyvyyskartoitus
                </ButtonLink>
                <a href="#palvelut" className="inline-flex min-h-11 items-center text-sm font-semibold text-foreground underline decoration-white/40 underline-offset-[6px] transition-colors hover:decoration-white focus-visible:decoration-white">
                  Katso palvelut ja hinnat <span aria-hidden="true" className="ml-2">↗</span>
                </a>
              </div>
              <div className="mt-10 max-w-[600px] space-y-1 border-t border-white/20 pt-6 text-sm leading-7 text-foreground/85" aria-label="Näkyvyyskartoituksen toimitus">
                <p>Lähetä verkkosivusi osoite. <a href="/aloita" className="underline underline-offset-4">Ei vielä verkkosivuja? Jätä aloituspyyntö.</a></p>
                <p>Tarkistamme sivun, Google-löydettävyyden ja yhteydenottopolun.</p>
                <p className="font-semibold text-foreground">Saat kolme tärkeintä korjausehdotusta kahdessa arkipäivässä. Maksuton, ei ostopakkoa.</p>
              </div>
            </div>
          </SectionContainer>
        </section>

        <section className="border-b border-border/75 py-12 sm:py-16" aria-labelledby="visibility-title">
          <SectionContainer>
            <div className="max-w-[760px]">
              <h2 id="visibility-title" className=" ui-heading-section">Sinä osaat työsi. Näkeekö asiakas sen verkossa?</h2>
              <p className="mt-7 text-base leading-8 text-muted">Asiakas haluaa tietää, mitä teet, missä palvelet ja miksi sinuun voi luottaa.</p>
              <p className="mt-5 text-base leading-8 text-muted">Vanhentuneet sivut, puutteelliset yritystiedot tai hiljainen some voivat jättää nämä kysymykset auki. Virella auttaa näyttämään työnjälkesi, selkeyttämään palvelusi ja rakentamaan suoran polun tarjouspyyntöön.</p>
            </div>
          </SectionContainer>
        </section>

        <section id="esimerkkikartoitus" className="border-b border-border/75 py-12 sm:py-16 lg:py-20" aria-labelledby="preview-title">
          <SectionContainer>
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
              <div className="max-w-[460px]">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Kartoituksen esimerkki</p>
                <h2 id="preview-title" className="mt-6 text-foreground ui-heading-section">
                  Kolme konkreettista korjausta. Selkeässä järjestyksessä.
                </h2>
                <p className="mt-7 text-base leading-8 text-muted">
                  Esimerkkiraportti näyttää, miten havainto, sen vaikutus ja suositeltu korjaus esitetään.
                </p>
                <a href="/aloita?kartoitus=1" className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground">
                  Pyydä oma kartoituksesi <span aria-hidden="true" className="ml-2">↗</span>
                </a>
              </div>
              <figure className="min-w-0">
                <div className="overflow-hidden rounded-2xl border border-border bg-surface p-2 sm:p-3">
                  <Image
                    src="/images/kartoitus-esimerkki.svg"
                    alt="Havainnekuva näkyvyyskartoituksen malliraportista: kolme esimerkkikorjausta verkkosivun viestiin, Google-yritysprofiiliin ja tarjouspyyntöpolkuun."
                    width={760}
                    height={648}
                    loading="lazy"
                    unoptimized
                    className="h-auto w-full rounded-xl"
                  />
                </div>
                <figcaption className="mt-4 text-center text-sm leading-6 text-muted">
                  Mallikartoituksen esikatselu – ei oikea asiakasraportti.
                </figcaption>
              </figure>
            </div>
          </SectionContainer>
        </section>

        <section id="palvelut" className="scroll-mt-28 border-y border-border/75 bg-cloud py-12 sm:py-16 lg:py-20" aria-labelledby="services-title">
          <SectionContainer>
            <div className="max-w-[670px]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Virellan palvelut</p>
              <h2 id="services-title" className="mt-6 ui-heading-section">
                Apua siihen, mikä yrityksesi näkyvyydessä kaipaa korjausta.
              </h2>
              <p className="mt-7 text-base leading-8 text-muted">
                Valitse yrityksesi tilanteeseen sopiva palvelu. Kaikkea ei tarvitse hankkia kerralla.
              </p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:gap-7">
              {services.map((service) => (
                <article key={service.name} className="ui-card ui-service-card flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.09em] text-muted">{service.name}</p>
                    <span className="font-sans text-xs text-muted">{service.number}</span>
                  </div>
                  <h3 className="mt-8 ui-heading-card text-foreground">{service.headline}</h3>
                  <p className="mt-5 text-[15px] leading-[1.8] text-muted">{service.description}</p>
                  <div className="mt-8 border-t border-border pt-7" aria-label={`${service.name} -palvelun hinta`}>
                    <dl className="space-y-4">
                      <div><dt className="text-sm text-muted">Aloitus</dt><dd><PriceDisplay className="mt-1" amount={service.pricing.startup} size="small" /></dd></div>
                      <div><dt className="text-sm text-muted">Kuukausipalvelu</dt><dd><PriceDisplay className="mt-1" amount={service.pricing.monthly} size="small" /></dd></div>
                    </dl>
                    <p className="mt-4 text-sm leading-6 text-muted">{service.pricing.note}</p>
                  </div>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-foreground">
                    {service.details.map((detail) => (
                      <li key={detail} className="flex gap-3"><span className="text-muted" aria-hidden="true">✓</span>{detail}</li>
                    ))}
                  </ul>
                  <a href={service.href} className="mt-10 inline-flex min-h-11 items-center font-semibold text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground lg:mt-auto lg:pt-9">
                    {service.action} <span aria-hidden="true" className="ml-2">↗</span>
                  </a>
                </article>
              ))}
            </div>
            <p className="mt-7 text-sm leading-6 text-muted">{taxConfig.publicMessage}</p>
          </SectionContainer>
        </section>

        <section id="prosessi" className="scroll-mt-28 py-12 sm:py-16 lg:py-20" aria-labelledby="process-title">
          <SectionContainer>
            <div className="grid gap-9 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Näin aloitat</p>
                <h2 id="process-title" className="mt-6 ui-heading-section">
                  Ensin selvitetään tarve. Sitten päätät toteutuksesta.
                </h2>
              </div>
              <p className="self-end text-base leading-8 text-muted">
                Et tarvitse valmista suunnitelmaa. Kerro tilanteesi, niin sovitaan siihen sopiva seuraava askel.
              </p>
            </div>
            <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
              {steps.map((step) => (
                <li key={step.number} className="border-t border-border pt-8">
                  <span className="font-sans text-sm text-muted">{step.number}</span>
                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.01em]">{step.title}</h3>
                  <p className="mt-5 text-[15px] leading-[1.8] text-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </SectionContainer>
        </section>

        <section className="border-t border-border/75 py-12 sm:py-16" aria-labelledby="partner-title">
          <SectionContainer>
            <div className="max-w-[760px]">
              <h2 id="partner-title" className=" ui-heading-section">Yksi yhteyshenkilö. Selkeästi sovittu työ.</h2>
              <p className="mt-7 text-base leading-8 text-muted">Virella Helsingin takana on {businessConfig.contactName}. Keskustelet suoraan tekijän kanssa ja tiedät, mitä työ sisältää.</p>
              <p className="mt-5 text-base leading-8 text-muted">Sinä tuot yrityksesi osaamisen ja aidot materiaalit. Me autamme muuttamaan ne selkeäksi verkkonäkyvyydeksi.</p>
            </div>
          </SectionContainer>
        </section>

        <section id="yhteys" className="scroll-mt-28 border-t border-border/75 bg-cloud py-12 sm:py-16 lg:py-20" aria-labelledby="contact-title">
          <SectionContainer>
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-20">
              <div className="max-w-[730px]">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Seuraava askel</p>
                <h2 id="contact-title" className="mt-6 ui-heading-section">
                  Mitä yrityksesi näkyvyydessä kannattaa korjata ensin?
                </h2>
                <p className="mt-5 text-base leading-8 text-muted">
                  Lähetä verkkosivusi osoite, niin selvitetään tärkein kehityskohde.
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-4 md:self-center">
                <ButtonLink href="/aloita?kartoitus=1">
                  Pyydä maksuton näkyvyyskartoitus
                </ButtonLink>
                <a href={businessConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
                  Keskustele WhatsAppissa<span className="sr-only"> (avautuu uuteen välilehteen)</span>
                </a>
              </div>
            </div>
          </SectionContainer>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
