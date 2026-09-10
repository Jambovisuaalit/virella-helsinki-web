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

const promises = [
  ["Kiinteä hinta", "Tiedät kustannuksen ennen ostamista."],
  ["Selkeä scope", "Näet tarkasti, mitä palveluun kuuluu."],
  ["Hands-free", "Virella hoitaa toteutuksen sovitun mallin mukaan."],
  ["Ei myyntipalaveria", "Valitse palvelu, maksa verkossa ja täytä alkukysely."],
] as const;

const services = [
  { key: "instagram", title: "Instagram", href: "/instagram", text: "Jatkuva sisältöpalvelu ilman omaa sisältötiimiä." },
  { key: "linkedin", title: "LinkedIn", href: "/linkedin", text: "B2B-sisältö ja profiilin kehitys valmiina palveluna." },
  { key: "landingPageSeo", title: "Landing Page + SEO", href: "/landing-page-seo", text: "Yksi selkeä, responsiivinen ja hakukonevalmis myyntisivu." },
] as const;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="overflow-hidden border-b border-border">
          <SectionContainer className="py-14 md:py-24">
            <div className="max-w-[800px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Markkinointi valmiina palveluna</p>
              <h1 className="mt-5 text-[2.65rem] font-extrabold leading-[1.01] tracking-[-0.05em] sm:text-5xl md:text-[4rem]">
                Ulkoista markkinointi. Pidä fokus liiketoiminnassa.
              </h1>
              <p className="mt-6 max-w-[680px] text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Valitse valmis palvelu kiinteällä hinnalla. Scope on määritelty etukäteen, toteutus on hands-free ja pääset alkuun ilman myyntipalaveria.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#services">Katso palvelut ja hinnat</ButtonLink>
                <ButtonLink href="#how" variant="secondary">Näin ostaminen toimii</ButtonLink>
              </div>
            </div>

            <div className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {promises.map(([title, text]) => (
                <div key={title} className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-extrabold text-brand">{title}</p>
                  <p className="mt-1 text-sm leading-5 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </SectionContainer>
        </section>

        <section id="services" className="bg-surface">
          <SectionContainer className="py-16 md:py-24">
            <div className="max-w-[720px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Palvelut</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Hinta ja sisältö näkyvät ennen ostamista.</h2>
              <p className="mt-4 text-base leading-7 text-muted sm:text-lg">Ei tarjouspyyntökierrosta eikä epäselvää tuntihinnoittelua. Valitse tarpeeseen sopiva valmis palvelu.</p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
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
                    <Link href={service.href} className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-action px-5 py-3 text-sm font-bold text-white">Tutustu ja osta</Link>
                  </Card>
                );
              })}
            </div>
          </SectionContainer>
        </section>

        <section id="how" className="border-y border-border bg-cloud">
          <SectionContainer className="py-16 md:py-24">
            <div className="max-w-[720px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Hands-free palvelupolku</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Kolme vaihetta. Ei myyntipalaveria.</h2>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ["01", "Valitse palvelu", "Näet hinnan, scopetuksen ja toimituksen ennen päätöstä."],
                ["02", "Maksa verkossa", "Maksun jälkeen oikea tuotekohtainen alkukysely avautuu automaattisesti."],
                ["03", "Täytä alkukysely", "Virella saa toteutukseen tarvittavat tiedot ilman erillistä myyntipalaveria."],
              ].map(([number, title, text]) => (
                <Card key={number} className="p-6 shadow-none">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">{number}</span>
                  <h3 className="mt-6 text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
                </Card>
              ))}
            </ol>
          </SectionContainer>
        </section>

        <section className="bg-brand text-white">
          <SectionContainer className="py-16 md:py-20">
            <div className="max-w-[720px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/65 sm:text-sm">Valmis aloittamaan?</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Valitse palvelu. Maksa. Täytä alkukysely.</h2>
              <p className="mt-4 text-base leading-7 text-white/75">Kiinteä hinta, selkeä scope ja hands-free toteutus yhdestä palvelupolusta.</p>
              <ButtonLink href="#services" className="mt-7 border-white/20 bg-white text-brand hover:bg-cloud" variant="secondary">Katso palvelut</ButtonLink>
            </div>
          </SectionContainer>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
