import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ButtonLink } from "@/components/ui/button";
import { businessConfig } from "@/config/business";
import { seoConfig } from "@/config/seo";

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
    headline: "Yrityksesi näkyy aktiivisena.",
    description: "Sosiaalisen median sisällöntuotanto, julkaisukalenteri ja sovitut julkaisut ilman omaa somevastaavaa.",
    details: ["Instagram ja Facebook", "12 julkaisua kuukaudessa", "Hyväksyntä ennen julkaisua"],
    href: "/sosiaalinen-media",
    action: "Tutustu somepalveluun",
  },
  {
    number: "02",
    name: "Virella Löydettävyys",
    headline: "Asiakas löytää sinut Googlesta.",
    description: "Google-yritysprofiilin, paikallisen hakunäkyvyyden ja arvosteluprosessin kehittäminen.",
    details: ["Google Business Profile", "Paikallinen SEO", "Seuranta ja kehitys"],
    href: "/aloita?kartoitus=1",
    action: "Pyydä näkyvyyskartoitus",
  },
  {
    number: "03",
    name: "Virella Liidit",
    headline: "Kiinnostus muuttuu yhteydenotoksi.",
    description: "Selkeä laskeutumissivu, helppo tarjouspyyntöpolku ja mitattavat toimintakehotukset.",
    details: ["Laskeutumissivut", "Yhteydenottolomakkeet", "Konversion seuranta"],
    href: "/aloita?kartoitus=1",
    action: "Pyydä näkyvyyskartoitus",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Kerro yrityksestäsi.",
    description: "Lähetä verkkosivusi tai yrityksesi tiedot. Voit aloittaa maksuttomalla näkyvyyskartoituksella.",
  },
  {
    number: "02",
    title: "Tunnistamme tärkeimmät korjaukset.",
    description: "Tarkastelemme verkkosivujen, Google-näkyvyyden, sosiaalisen median ja yhteydenottopolun tilannetta.",
  },
  {
    number: "03",
    title: "Sovimme selkeän toteutuksen.",
    description: "Saat ehdotuksen tärkeimmistä toimenpiteistä. Mahdollinen maksullinen työ sovitaan erikseen.",
  },
] as const;

export default function Home() {
  return (
    <div className="landing-page min-h-screen">
      <a href="#main-content" className="landing-skip-link">Siirry sisältöön</a>
      <SiteHeader />
      <main id="main-content">
        <section className="px-0 pb-14 pt-24 sm:pb-20 sm:pt-32 lg:pt-36" aria-labelledby="home-title">
          <SectionContainer>
            <div className="mx-auto max-w-[1040px] text-center">
              <p className="mb-7 text-xs font-bold uppercase tracking-[0.17em] text-brand sm:text-sm">
                Digitaalista näkyvyyttä paikallisille palveluyrityksille
              </p>
              <h1 id="home-title" className="text-[clamp(2.65rem,6.1vw,5.25rem)] font-extrabold leading-[1.08] tracking-[-0.062em] text-foreground">
                Enemmän näkyvyyttä.<br />
                Enemmän luottamusta.<br />
                <span className="text-brand">Enemmän yhteydenottoja.</span>
              </h1>
              <p className="mx-auto mt-7 max-w-[640px] text-base leading-8 text-muted sm:text-lg">
                Virella Helsinki hoitaa paikallisen yrityksesi verkkosivut, Google-näkyvyyden ja sosiaalisen median, jotta sinä voit keskittyä asiakkaisiin ja työn tekemiseen.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink href="/aloita?kartoitus=1" className="w-full max-w-[330px] sm:w-auto">
                  Pyydä maksuton näkyvyyskartoitus
                </ButtonLink>
                <ButtonLink href="#palvelut" variant="secondary" className="w-full max-w-[330px] sm:w-auto">
                  Tutustu palveluihin
                </ButtonLink>
              </div>
              <p className="mt-5 text-sm text-muted">
                Kartoitus ei sido palvelun ostamiseen.
              </p>
            </div>
            <div className="mt-20 grid grid-cols-2 gap-y-5 border-y border-border py-6 text-center text-sm font-medium text-muted md:grid-cols-4 md:gap-y-0">
              {["Verkkosivut", "Google-löydettävyys", "Sosiaalinen media", "Yhteydenottopolku"].map((item, index) => (
                <span key={item} className={index % 2 === 1 ? "border-l border-border px-3 md:border-l" : "px-3 md:border-l md:first:border-l-0"}>
                  {item}
                </span>
              ))}
            </div>
          </SectionContainer>
        </section>

        <section id="palvelut" className="scroll-mt-28 border-y border-border bg-cloud py-20 sm:py-24" aria-labelledby="services-title">
          <SectionContainer>
            <div className="max-w-[760px]">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-brand">Virellan palvelut</p>
              <h2 id="services-title" className="mt-4 text-[clamp(2.1rem,4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.045em]">
                Näy. Löydy. Saa yhteydenottoja.
              </h2>
              <p className="mt-5 text-base leading-8 text-muted">
                Valitse yrityksesi tilanteeseen sopiva palvelu. Kaikkea ei tarvitse hankkia kerralla.
              </p>
            </div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.name} className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">{service.name}</p>
                    <span className="text-xs text-muted">{service.number}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold leading-[1.17] tracking-[-0.03em] text-foreground">{service.headline}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{service.description}</p>
                  <ul className="mt-6 space-y-3 border-t border-border pt-5 text-sm text-foreground">
                    {service.details.map((detail) => (
                      <li key={detail} className="flex gap-3"><span className="text-brand" aria-hidden="true">✓</span>{detail}</li>
                    ))}
                  </ul>
                  <a href={service.href} className="mt-9 inline-flex min-h-11 items-center font-semibold text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-strong lg:mt-auto lg:pt-7">
                    {service.action} <span aria-hidden="true" className="ml-2">↗</span>
                  </a>
                </article>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div>
                <h3 className="text-lg font-bold text-foreground">Tarvitsetko myös uudet verkkosivut?</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  Rakennamme yrityksellesi selkeät, mobiilissa toimivat verkkosivut ja toimivan yhteydenottopolun.
                </p>
              </div>
              <ButtonLink href="/aloita" variant="secondary" className="shrink-0">Kerro sivustotarpeestasi</ButtonLink>
            </div>
          </SectionContainer>
        </section>

        <section id="prosessi" className="scroll-mt-28 py-20 sm:py-24" aria-labelledby="process-title">
          <SectionContainer>
            <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-brand">Näin aloitat</p>
                <h2 id="process-title" className="mt-4 text-[clamp(2.1rem,4vw,3.1rem)] font-bold leading-[1.12] tracking-[-0.045em]">
                  Ensin tärkeimmät korjaukset. Sitten toteutus.
                </h2>
              </div>
              <p className="self-end text-base leading-8 text-muted">
                Ei yleistä markkinointijargonia. Katsomme, mistä asiakkaasi löytävät yrityksesi ja miten heidän on helpointa ottaa yhteyttä.
              </p>
            </div>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <li key={step.number} className="border-t border-border pt-6">
                  <span className="text-sm font-bold text-brand">{step.number}</span>
                  <h3 className="mt-7 text-xl font-bold tracking-[-0.025em]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </SectionContainer>
        </section>

        <section id="yhteys" className="scroll-mt-28 border-t border-border bg-cloud py-20 sm:py-24" aria-labelledby="contact-title">
          <SectionContainer>
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-[730px]">
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-brand">Seuraava askel</p>
                <h2 id="contact-title" className="mt-4 text-[clamp(2.1rem,4vw,3.2rem)] font-bold leading-[1.12] tracking-[-0.045em]">
                  Selvitetään, mistä kasvun esteet löytyvät.
                </h2>
                <p className="mt-5 text-base leading-8 text-muted">
                  Pyydä maksuton digitaalisen näkyvyyden kartoitus. Saat arvion kolmesta tärkeimmästä korjauskohteesta ilman ostopakkoa.
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
