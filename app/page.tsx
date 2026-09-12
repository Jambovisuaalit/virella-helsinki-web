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
  ["72 h", "Toimitusaika lähtötietojen jälkeen"],
  ["1 kierros", "Koottu korjauskierros mukana"],
  ["Ei palaveripakkoa", "Maksa verkossa ja aloita kyselyllä"],
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
        <section className="overflow-hidden border-b border-border bg-background">
          <SectionContainer className="grid gap-10 py-14 md:grid-cols-[1.08fr_0.92fr] md:items-center md:py-24 lg:gap-16">
            <div className="max-w-[720px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand">
                Conversion Fix · {euro.format(conversionFix.price)} kertamaksu
              </div>
              <h1 className="mt-6 text-[2.75rem] font-extrabold leading-[0.99] tracking-[-0.055em] sm:text-5xl md:text-[4.25rem]">
                Korjaa verkkosivun myyntiä estävät kohdat 72 tunnissa.
              </h1>
              <p className="mt-6 max-w-[680px] text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Nykyinen sivusto kuntoon ilman täyttä verkkosivuprojektia. Korjaamme pääviestin, CTA-polun, mobiilin kriittiset ongelmat ja muut sovitut konversioesteet kiinteällä hinnalla.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/verkkosivu-kuntoon">Katso Conversion Fix</ButtonLink>
                <ButtonLink href="#services" variant="secondary">Muut palvelut</ButtonLink>
              </div>
              <p className="mt-5 text-sm leading-6 text-muted">Ei myyntipalaveria ennen ostoa. Maksun jälkeen täytät lyhyen aloituskyselyn.</p>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 -z-10 rounded-full bg-brand/5 blur-3xl" aria-hidden="true" />
              <Card className="overflow-hidden border-brand/15 bg-surface shadow-[0_28px_80px_-38px_rgba(31,36,46,0.35)]">
                <div className="border-b border-border bg-brand px-5 py-4 text-white sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Conversion audit</p>
                      <p className="mt-1 font-extrabold">Kolme ensimmäistä tarkistusta</p>
                    </div>
                    <span className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-bold">72 h</span>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {conversionChecks.map(([number, title, text]) => (
                    <div key={number} className="grid grid-cols-[42px_1fr] gap-3 p-5 sm:p-6">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cloud text-xs font-extrabold text-brand">{number}</span>
                      <div>
                        <p className="font-extrabold text-foreground">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border bg-cloud/60 px-5 py-4 sm:px-6">
                  <span className="text-sm font-semibold text-muted">Kiinteä toimitus</span>
                  <span className="text-xl font-extrabold tracking-[-0.03em] text-brand">{euro.format(conversionFix.price)}</span>
                </div>
              </Card>
            </div>
          </SectionContainer>
        </section>

        <section className="border-b border-border bg-surface">
          <SectionContainer className="grid gap-2 py-5 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map(([title, text]) => (
              <div key={title} className="rounded-xl border border-border bg-background px-4 py-3.5">
                <p className="font-extrabold text-brand">{title}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{text}</p>
              </div>
            ))}
          </SectionContainer>
        </section>

        <section id="services" className="bg-surface">
          <SectionContainer className="py-16 md:py-24">
            <div className="max-w-[760px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Palvelut</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Yksi pääoffer. Muut palvelut tarpeen mukaan.</h2>
              <p className="mt-4 text-base leading-7 text-muted sm:text-lg">Conversion Fix on nopein tapa aloittaa. Sisältö- ja landing-palvelut ovat erillisiä, valmiiksi rajattuja toimituksia.</p>
            </div>

            <Card className="mt-10 grid overflow-hidden border-brand/20 bg-background shadow-none lg:grid-cols-[1.25fr_0.75fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Suositeltu aloitus</p>
                <h3 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Conversion Fix</h3>
                <p className="mt-4 max-w-[650px] text-base leading-7 text-muted">Korjataan nykyisen sivuston tärkeimmät myyntiä estävät kohdat ilman uudelleenrakennusta. Selkeä scope, kiinteä hinta ja yksi koottu korjauskierros.</p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-brand">
                  <span className="rounded-full border border-brand/15 bg-brand/5 px-3 py-1.5">72 h</span>
                  <span className="rounded-full border border-brand/15 bg-brand/5 px-3 py-1.5">8 tarkistuskohdetta</span>
                  <span className="rounded-full border border-brand/15 bg-brand/5 px-3 py-1.5">1 korjauskierros</span>
                </div>
              </div>
              <div className="flex flex-col justify-between border-t border-border bg-cloud/60 p-6 sm:p-8 lg:border-l lg:border-t-0">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Kiinteä hinta</p>
                  <p className="mt-3 text-4xl font-extrabold tracking-[-0.045em]">{euro.format(conversionFix.price)}</p>
                  <p className="mt-1 text-sm text-muted">kertamaksu</p>
                </div>
                <Link href="/verkkosivu-kuntoon" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-action px-5 py-3 text-sm font-bold text-white transition hover:brightness-90">Tutustu ja osta</Link>
              </div>
            </Card>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {services.map((service) => {
                const product = products[service.key];
                return (
                  <Card key={service.key} className="flex flex-col p-6 shadow-none">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">{service.title}</p>
                    <p className="mt-5 text-3xl font-extrabold tracking-[-0.04em]">
                      {euro.format(product.price)}{product.billing === "month" ? <span className="text-sm font-semibold text-muted"> / kk</span> : null}
                    </p>
                    {product.billing === "month" ? <p className="mt-1 text-sm text-muted">{product.commitmentMonths} kk · yhteensä {euro.format(product.totalPrice)}</p> : <p className="mt-1 text-sm text-muted">Kertamaksu</p>}
                    <p className="mt-5 flex-1 text-sm leading-6 text-muted">{service.text}</p>
                    <Link href={service.href} className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition hover:bg-cloud">Tutustu palveluun</Link>
                  </Card>
                );
              })}
            </div>
          </SectionContainer>
        </section>

        <section id="how" className="border-y border-border bg-cloud">
          <SectionContainer className="py-16 md:py-24">
            <div className="max-w-[720px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Näin aloitat</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Kolme vaihetta. Ei turhaa kitkaa.</h2>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ["01", "Valitse palvelu", "Näet hinnan, rajauksen ja toimituksen ennen päätöstä."],
                ["02", "Maksa verkossa", "Stripe Checkout vahvistaa maksun ja liittää sen oikeaan palveluun."],
                ["03", "Täytä alkukysely", "Virella saa toteutukseen tarvittavat tiedot ilman erillistä myyntipalaveria."],
              ].map(([number, title, text]) => (
                <li key={number}>
                  <Card className="h-full p-6 shadow-none">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">{number}</span>
                    <h3 className="mt-6 text-xl font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
                  </Card>
                </li>
              ))}
            </ol>
          </SectionContainer>
        </section>

        <section className="bg-brand text-white">
          <SectionContainer className="py-16 md:py-20">
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[720px]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/65 sm:text-sm">Aloita näkyvimmästä pullonkaulasta</p>
                <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Conversion Fix · 690 € · 72 h.</h2>
                <p className="mt-4 text-base leading-7 text-white/75">Korjataan ensin se, minkä asiakas näkee ja kokee ennen yhteydenottoa.</p>
              </div>
              <ButtonLink href="/verkkosivu-kuntoon" className="shrink-0 border-white/20 bg-white text-brand hover:bg-cloud" variant="secondary">Katso Conversion Fix</ButtonLink>
            </div>
          </SectionContainer>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
