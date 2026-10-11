import type { Metadata } from "next";
import Image from "next/image";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ButtonLink } from "@/components/ui/button";
import { businessConfig } from "@/config/business";
import { seoConfig } from "@/config/seo";
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
    headline: "Sovittu määrä somejulkaisuja joka kuukausi.",
    price: "490 €/kk",
    priceDetail: "3 kk vähimmäisjakso",
    description: "Sovittu määrä julkaisuja, suunnittelu ja hyväksyntä ennen julkaisua.",
    details: ["Instagram ja Facebook", "12 julkaisua kuukaudessa", "Hyväksyntä ennen julkaisua"],
    href: "/sosiaalinen-media",
    action: "Tutustu somepalveluun",
  },
  {
    number: "02",
    name: "Virella Löydettävyys",
    headline: "Google-yritysprofiili ja paikallinen löydettävyys kuntoon.",
    price: "590 € aloitus",
    priceDetail: "Ylläpito 290 €/kk",
    description: "Google-yritysprofiilin tiedot, paikallinen löydettävyys ja seuranta.",
    details: ["Google Business Profile", "Paikallinen SEO", "Seuranta ja kehitys"],
    href: "/aloita?kartoitus=1",
    action: "Pyydä näkyvyyskartoitus",
  },
  {
    number: "03",
    name: "Virella Liidit",
    headline: "Selkeä polku tarjouspyyntöön.",
    price: "1 500 € aloitus",
    priceDetail: "Ylläpito alkaen 500 €/kk",
    description: "Laskeutumissivu, tarjouspyyntöpolku ja niiden toimivuuden seuranta.",
    details: ["Laskeutumissivut", "Yhteydenottolomakkeet", "Konversion seuranta"],
    href: "/aloita?kartoitus=1",
    action: "Pyydä näkyvyyskartoitus",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Lähetä lähtötiedot.",
    description: "Anna verkkosivun osoite ja yhteystiedot. Lisähuomiot ovat vapaaehtoisia.",
  },
  {
    number: "02",
    title: "Käymme tiedot läpi.",
    description: "Arvioimme julkiset tiedot ja asetamme havainnot tärkeysjärjestykseen.",
  },
  {
    number: "03",
    title: "Päätät jatkosta.",
    description: "Saat ehdotukset sähköpostitse. Toteutuksesta sovitaan vain halutessasi.",
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
              <h1 id="home-title" className="max-w-[720px] text-[clamp(1.9rem,8.4vw,2.25rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground sm:text-[clamp(2.25rem,5.3vw,4.6rem)]">
                Verkkosivut, <span className="whitespace-nowrap">Google-näkyvyys</span> ja some.{" "}
                <span className="text-brand">Yhdeltä tekijältä.</span>
              </h1>
              <p className="mt-7 max-w-[540px] text-base leading-[1.8] text-foreground/90 sm:mt-9 sm:text-lg">
                Suunnittelu, toteutus ja yhteydenpito samasta paikasta. Valitset itse, mitä palveluita yrityksesi tarvitsee.
              </p>
              <div className="mt-8 flex flex-col items-start gap-4 sm:mt-9 sm:flex-row sm:items-center sm:gap-7">
                <ButtonLink href="/aloita?kartoitus=1" className="w-fit max-w-full px-4 sm:px-5">
                  Pyydä maksuton kartoitus
                </ButtonLink>
                <a href="#palvelut" className="inline-flex min-h-11 items-center text-sm font-semibold text-foreground underline decoration-white/40 underline-offset-[6px] transition-colors hover:decoration-white focus-visible:decoration-white">
                  Katso palvelut ja hinnat <span aria-hidden="true" className="ml-2">↗</span>
                </a>
              </div>
              <div className="mt-9 max-w-[600px] space-y-1 border-t border-white/20 pt-6 text-sm leading-7 text-foreground/90 sm:mt-10" aria-label="Näkyvyyskartoituksen toimitus">
                <p>Lähetä verkkosivusi osoite.</p>
                <p>Tarkistamme sivun, Google-löydettävyyden ja yhteydenottopolun.</p>
                <p className="font-semibold text-foreground">Saat 3 tärkeintä korjausehdotusta 2 arkipäivässä.</p>
              </div>
            </div>
          </SectionContainer>
        </section>

        <section id="esimerkkikartoitus" className="virella-section-block border-b border-border/75" aria-labelledby="preview-title">
          <SectionContainer>
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
              <div className="max-w-[460px]">
                <p className="virella-section-eyebrow">Kartoituksen esimerkki</p>
                <h2 id="preview-title" className="virella-section-title">
                  Tältä kartoituksen yhteenveto näyttää.
                </h2>
                <p className="virella-section-copy">
                  Esimerkissä havainnot on järjestetty tärkeysjärjestykseen. Jokaisella korjauksella on selkeä tavoite.
                </p>
                <a href="/aloita?kartoitus=1" className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground">
                  Pyydä oma kartoituksesi <span aria-hidden="true" className="ml-2">↗</span>
                </a>
              </div>
              <figure className="min-w-0">
                <div className="virella-audit-preview rounded-2xl border border-border bg-surface p-5 sm:p-7" aria-label="Havainnollistava esimerkkikartoitus">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5 sm:pb-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Virella Helsinki</p>
                      <h3 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-foreground sm:text-2xl">
                        Kartoituksen yhteenveto
                      </h3>
                    </div>
                    <span className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted">Esimerkki</span>
                  </div>
                  <ol className="divide-y divide-border" aria-label="Kolme havainnollistavaa korjausehdotusta">
                    {[
                      { title: "Selkeytä etusivun viestiä", detail: "Kerro heti, mitä yrityksesi tekee." },
                      { title: "Tarkista Google-yritysprofiili", detail: "Varmista palvelut ja toimialue." },
                      { title: "Helpota yhteydenottoa", detail: "Tuo selkeä yhteydenottotapa esiin." },
                    ].map((item, index) => (
                      <li key={item.title} className="flex gap-4 py-5 sm:gap-6 sm:py-6">
                        <span className="shrink-0 pt-0.5 font-mono text-sm font-semibold text-muted">{String(index + 1).padStart(2, "0")}</span>
                        <div className="min-w-0">
                          <h4 className="text-base font-semibold leading-snug tracking-[-0.01em] text-foreground sm:text-lg">{item.title}</h4>
                          <p className="mt-2 text-sm leading-6 text-muted sm:text-[15px]">{item.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                <figcaption className="mt-4 text-center text-sm leading-6 text-muted">
                  Mallikartoituksen esikatselu – ei oikea asiakasraportti.
                </figcaption>
              </figure>
            </div>
          </SectionContainer>
        </section>

        <section id="palvelut" className="virella-section-block scroll-mt-28 border-y border-border/75 bg-cloud" aria-labelledby="services-title">
          <SectionContainer>
            <div className="max-w-[670px]">
              <p className="virella-section-eyebrow">Virellan palvelut</p>
              <h2 id="services-title" className="virella-section-title">
                Kolme palvelua. Yksi selkeä toteutus.
              </h2>
              <p className="virella-section-copy">
                Palvelut ovat erillisiä. Voit aloittaa yhdestä ja laajentaa tarpeen mukaan.
              </p>
            </div>
            <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-7">
              {services.map((service) => (
                <article key={service.name} className="flex h-full flex-col rounded-2xl border border-border/85 bg-surface px-7 py-9 sm:px-8 sm:py-10">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.09em] text-muted">{service.name}</p>
                    <span className="font-mono text-xs text-muted">{service.number}</span>
                  </div>
                  <h3 className="mt-8 text-[1.45rem] font-semibold leading-[1.22] tracking-[-0.015em] text-foreground">{service.headline}</h3>
                  <p className="mt-5 text-[15px] leading-[1.8] text-muted">{service.description}</p>
                  <div className="mt-8 border-t border-border pt-7" aria-label={`${service.name} -palvelun hinta`}>
                    <p className="text-[1.75rem] font-semibold tracking-[-0.02em] text-foreground">{service.price}</p>
                    <p className="mt-2 text-sm text-muted">{service.priceDetail}</p>
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
            <div className="mt-12 flex flex-col gap-7 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-12">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Tarvitsetko myös uudet verkkosivut?</h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
                  Rakennamme yrityksellesi mobiilissa toimivat verkkosivut ja selkeän yhteydenottopolun. Hinta alkaen 1 500 €.
                </p>
              </div>
              <ButtonLink href="/aloita" variant="secondary" className="shrink-0">Kerro sivustotarpeestasi</ButtonLink>
            </div>
          </SectionContainer>
        </section>

        <section id="prosessi" className="virella-section-block scroll-mt-28" aria-labelledby="process-title">
          <SectionContainer>
            <div className="grid gap-9 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
              <div>
                <p className="virella-section-eyebrow">Näin aloitat</p>
                <h2 id="process-title" className="virella-section-title">
                  Ensin kartoitus. Sitten päätät jatkosta.
                </h2>
              </div>
              <p className="virella-section-copy self-end md:mt-0">
                Kartoitus perustuu julkisiin tietoihin. Se on maksuton eikä velvoita tilaamaan palvelua.
              </p>
            </div>
            <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12">
              {steps.map((step) => (
                <li key={step.number} className="border-t border-border pt-8">
                  <span className="font-mono text-sm text-muted">{step.number}</span>
                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.01em]">{step.title}</h3>
                  <p className="mt-5 text-[15px] leading-[1.8] text-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </SectionContainer>
        </section>

        <section id="yhteys" className="virella-section-block scroll-mt-28 border-t border-border/75 bg-cloud" aria-labelledby="contact-title">
          <SectionContainer>
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-20">
              <div className="max-w-[730px]">
                <p className="virella-section-eyebrow">Seuraava askel</p>
                <h2 id="contact-title" className="virella-section-title">
                  Aloitetaan nykytilanteestasi.
                </h2>
                <p className="virella-section-copy">
                  Saat selkeän lähtökohdan jatkotoimille ilman ostopakkoa.
                </p>
              </div>
              <ButtonLink href="/aloita?kartoitus=1" className="shrink-0 self-start md:self-center">
                Pyydä maksuton näkyvyyskartoitus
              </ButtonLink>
            </div>
          </SectionContainer>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
