import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products } from "@/config/products";

const euro = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const conversionChecks = [
  ["01", "Pääviesti", "Ymmärtääkö kävijä heti mitä myyt ja kenelle?"],
  ["02", "CTA-polku", "Onko seuraava askel näkyvä, selkeä ja helppo?"],
  ["03", "Mobiili", "Toimiiko tärkein ostopolku pienellä näytöllä ilman kitkaa?"],
] as const;

const promises = [
  ["690 €", "Kiinteä kertamaksu"],
  ["72 h", "Kun lähtötiedot ovat käytettävissä"],
  ["1 kierros", "Koottu korjauskierros mukana"],
  ["0", "Pakollista myyntipalaveria"],
] as const;

const services = [
  { key: "instagram", title: "Instagram", href: "/instagram", text: "Jatkuva sisältöpalvelu ilman omaa sisältötiimiä." },
  { key: "linkedin", title: "LinkedIn", href: "/linkedin", text: "B2B-sisältö ja profiilin kehitys valmiina palveluna." },
  { key: "landingPageSeo", title: "Landing Page + SEO", href: "/landing-page-seo", text: "Yksi selkeä, responsiivinen ja hakukonevalmis myyntisivu." },
] as const;

export default function Home() {
  const conversionFix = products.websiteFix;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden pb-12 pt-6 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-14">
          <div className="premium-grid pointer-events-none absolute inset-0 -z-20" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-24 top-8 -z-10 h-72 w-72 rounded-full bg-brand/8 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute right-[-8rem] top-[-5rem] -z-10 h-96 w-96 rounded-full bg-accent/8 blur-3xl" aria-hidden="true" />

          <SectionContainer className="grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
            <div className="max-w-[760px]">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-brand/15 bg-surface/80 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.17em] text-brand shadow-[0_10px_26px_-22px_rgba(23,33,38,0.45)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Conversion Fix · {euro.format(conversionFix.price)} · 72 h
              </div>

              <h1 className="mt-7 max-w-[760px] text-[3.15rem] font-extrabold leading-[0.93] tracking-[-0.065em] text-foreground sm:text-[4.4rem] lg:text-[5.35rem]">
                Korjaa sivu, joka näyttää hyvältä mutta ei vielä myy tarpeeksi hyvin.
              </h1>

              <p className="mt-7 max-w-[670px] text-[1.05rem] leading-8 text-muted sm:text-[1.16rem]">
                Käymme nykyisen verkkosivusi läpi, poistamme tärkeimmät yhteydenottoa heikentävät kohdat ja viimeistelemme sovitut korjaukset ilman täyttä verkkosivuprojektia.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/verkkosivu-kuntoon" className="sm:px-6">Katso Conversion Fix</ButtonLink>
                <ButtonLink href="#services" variant="secondary" className="sm:px-6">Muut palvelut</ButtonLink>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted">
                <span>Ei myyntipalaveripakkoa</span>
                <span className="hidden text-border sm:inline">•</span>
                <span>Ei salasanoja lomakkeella</span>
                <span className="hidden text-border sm:inline">•</span>
                <span>Yksi koottu korjauskierros</span>
              </div>
            </div>

            <div className="relative lg:pl-3">
              <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand/6 blur-2xl" aria-hidden="true" />
              <Card className="soft-ring overflow-hidden border-white/80 bg-surface/95 shadow-[0_36px_100px_-48px_rgba(23,33,38,0.45)] backdrop-blur">
                <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-white">CF</span>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand">Conversion audit</p>
                      <p className="mt-0.5 text-sm font-bold text-foreground">Ensimmäiset tarkistukset</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-brand/10 bg-brand/5 px-3 py-1.5 text-xs font-extrabold text-brand">72 h</span>
                </div>

                <div className="p-3 sm:p-4">
                  {conversionChecks.map(([number, title, text]) => (
                    <div key={number} className="grid grid-cols-[44px_1fr] gap-3 rounded-[1.1rem] px-3 py-4 transition hover:bg-cloud/65 sm:px-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-[11px] font-extrabold text-brand">{number}</span>
                      <div>
                        <p className="font-extrabold tracking-[-0.01em] text-foreground">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-border/70 bg-cloud/55 px-5 py-5 sm:px-6">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-muted">Scope</p>
                    <p className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-foreground">8 kohtaa</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-muted">Kiinteä hinta</p>
                    <p className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-brand">{euro.format(conversionFix.price)}</p>
                  </div>
                </div>
              </Card>
            </div>
          </SectionContainer>
        </section>

        <section className="border-y border-border/70 bg-surface/85">
          <SectionContainer className="grid sm:grid-cols-2 lg:grid-cols-4">
            {promises.map(([title, text], index) => (
              <div key={title} className={`py-6 sm:px-5 lg:py-7 ${index > 0 ? "sm:border-l sm:border-border/70" : ""}`}>
                <p className="text-2xl font-extrabold tracking-[-0.045em] text-brand">{title}</p>
                <p className="mt-1.5 max-w-[210px] text-xs leading-5 text-muted">{text}</p>
              </div>
            ))}
          </SectionContainer>
        </section>

        <section id="services" className="bg-background">
          <SectionContainer className="py-20 sm:py-24 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">Palvelut</p>
                <h2 className="mt-4 max-w-[680px] text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-5xl">Yksi selkeä tapa aloittaa.</h2>
              </div>
              <p className="max-w-[620px] text-base leading-7 text-muted lg:justify-self-end sm:text-lg">
                Conversion Fix korjaa nykyisen sivuston näkyvimmät myyntiesteet. Sisältö- ja landing-palvelut ovat erillisiä, valmiiksi rajattuja toimituksia.
              </p>
            </div>

            <Card className="mt-12 overflow-hidden border-brand/15 bg-surface shadow-[0_34px_90px_-52px_rgba(23,33,38,0.48)] lg:grid lg:grid-cols-[1.35fr_0.65fr]">
              <div className="relative p-7 sm:p-9 lg:p-11">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[5rem] bg-brand/5" aria-hidden="true" />
                <p className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-brand">Suositeltu aloitus</p>
                <h3 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">Conversion Fix</h3>
                <p className="mt-5 max-w-[680px] text-base leading-7 text-muted sm:text-lg">Korjataan nykyisen sivuston tärkeimmät myyntiä estävät kohdat ilman uudelleenrakennusta. Selkeä scope, kiinteä hinta ja yksi koottu korjauskierros.</p>
                <div className="mt-7 flex flex-wrap gap-2 text-[11px] font-extrabold text-brand">
                  <span className="rounded-full border border-brand/12 bg-brand/5 px-3.5 py-2">72 h</span>
                  <span className="rounded-full border border-brand/12 bg-brand/5 px-3.5 py-2">8 tarkistuskohdetta</span>
                  <span className="rounded-full border border-brand/12 bg-brand/5 px-3.5 py-2">1 korjauskierros</span>
                </div>
              </div>

              <div className="flex flex-col justify-between border-t border-border/70 bg-cloud/55 p-7 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted">Kiinteä kertamaksu</p>
                  <p className="mt-3 text-5xl font-extrabold tracking-[-0.055em] text-foreground">{euro.format(conversionFix.price)}</p>
                  <p className="mt-3 text-sm leading-6 text-muted">Ei ALV-lisää nykyisellä myyjästatuksella.</p>
                </div>
                <Link href="/verkkosivu-kuntoon" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-action px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_-16px_rgba(216,74,36,0.7)] transition hover:-translate-y-0.5 hover:brightness-[0.96]">Tutustu ja osta</Link>
              </div>
            </Card>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {services.map((service) => {
                const product = products[service.key];
                return (
                  <Card key={service.key} className="group flex flex-col p-6 shadow-none transition duration-200 hover:-translate-y-1 hover:border-brand/15 hover:shadow-[0_24px_60px_-42px_rgba(23,33,38,0.5)] sm:p-7">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-brand">{service.title}</p>
                    <p className="mt-7 text-3xl font-extrabold tracking-[-0.05em] text-foreground">
                      {euro.format(product.price)}{product.billing === "month" ? <span className="text-sm font-semibold tracking-normal text-muted"> / kk</span> : null}
                    </p>
                    {product.billing === "month" ? <p className="mt-1.5 text-xs text-muted">{product.commitmentMonths} kk · yhteensä {euro.format(product.totalPrice)}</p> : <p className="mt-1.5 text-xs text-muted">Kertamaksu</p>}
                    <p className="mt-7 flex-1 text-sm leading-6 text-muted">{service.text}</p>
                    <Link href={service.href} className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-border/90 bg-background px-4 py-2.5 text-sm font-bold text-foreground transition group-hover:border-brand/20 group-hover:bg-white">Tutustu palveluun</Link>
                  </Card>
                );
              })}
            </div>
          </SectionContainer>
        </section>

        <section id="how" className="relative overflow-hidden bg-brand text-white">
          <div className="pointer-events-none absolute inset-0 opacity-30 premium-grid" aria-hidden="true" />
          <div className="pointer-events-none absolute right-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-white/8 blur-3xl" aria-hidden="true" />
          <SectionContainer className="relative py-20 sm:py-24 lg:py-28">
            <div className="max-w-[760px]">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/60">Näin aloitat</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">Kolme vaihetta. Ei turhaa kitkaa.</h2>
            </div>

            <ol className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                ["01", "Valitse palvelu", "Näet hinnan, rajauksen ja toimituksen ennen päätöstä."],
                ["02", "Maksa verkossa", "Stripe Checkout vahvistaa maksun ja liittää sen oikeaan palveluun."],
                ["03", "Täytä aloituskysely", "Virella saa toteutukseen tarvittavat tiedot ilman erillistä myyntipalaveria."],
              ].map(([number, title, text]) => (
                <li key={number} className="rounded-[1.5rem] border border-white/12 bg-white/[0.07] p-6 backdrop-blur sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold tracking-[0.15em] text-white/55">STEP {number}</span>
                    <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  </div>
                  <h3 className="mt-10 text-xl font-extrabold tracking-[-0.025em] text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/68">{text}</p>
                </li>
              ))}
            </ol>
          </SectionContainer>
        </section>

        <section className="bg-background py-16 sm:py-20 lg:py-24">
          <SectionContainer>
            <div className="relative overflow-hidden rounded-[2rem] border border-brand/10 bg-surface px-6 py-10 shadow-[0_30px_90px_-56px_rgba(23,33,38,0.5)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-accent/8 blur-3xl" aria-hidden="true" />
              <div className="relative flex flex-col gap-9 md:flex-row md:items-end md:justify-between">
                <div className="max-w-[760px]">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">Conversion Fix · 690 € · 72 h</p>
                  <h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-5xl">Korjaa ensin se, mikä estää asiakasta ottamasta yhteyttä.</h2>
                  <p className="mt-5 max-w-[680px] text-base leading-7 text-muted sm:text-lg">Käymme läpi nykyisen verkkosivusi tärkeimmät myyntiesteet ja korjaamme sovitut kohdat ilman täyttä verkkosivuprojektia.</p>
                </div>
                <ButtonLink href="/verkkosivu-kuntoon" className="shrink-0 sm:px-6">Osta Conversion Fix</ButtonLink>
              </div>
            </div>
          </SectionContainer>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
