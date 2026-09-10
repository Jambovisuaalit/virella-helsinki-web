import { products, type ProductId } from "@/config/products";
import { taxConfig } from "@/config/tax";
import { servicePageContent } from "@/content/fi/services";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const euro = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

type ServiceLandingPageProps = {
  productKey: ProductId;
};

export function ServiceLandingPage({ productKey }: ServiceLandingPageProps) {
  const product = products[productKey];
  const content = servicePageContent[productKey];
  const monthly = product.billing === "month";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <SectionContainer className="grid gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-24 lg:gap-16">
            <div className="max-w-[720px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">{content.eyebrow}</p>
              <h1 className="mt-5 text-[2.55rem] font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-[3.75rem]">{content.title}</h1>
              <p className="mt-6 max-w-[680px] text-base leading-7 text-muted sm:text-lg sm:leading-8">{content.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#sisalto">Katso mitä palveluun kuuluu</ButtonLink>
                <ButtonLink href={`/alkukysely?product=${product.id}`} variant="secondary">Esikatsele aloituskyselyä</ButtonLink>
              </div>
            </div>

            <Card className="p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Hinta</p>
              <div className="mt-4 flex items-end gap-2">
                <p className="text-4xl font-extrabold tracking-[-0.04em] text-foreground">{euro.format(product.price)}</p>
                {monthly ? <p className="pb-1 text-sm font-semibold text-muted">/ kk</p> : null}
              </div>
              {product.totalPrice ? (
                <p className="mt-2 text-sm text-muted">{product.commitmentMonths} kk, yhteensä {euro.format(product.totalPrice)}</p>
              ) : (
                <p className="mt-2 text-sm text-muted">Kertamaksu</p>
              )}
              <p className="mt-5 border-t border-border pt-5 text-sm leading-6 text-muted">{taxConfig.publicMessage}</p>
            </Card>
          </SectionContainer>
        </section>

        <section id="sisalto" className="bg-surface">
          <SectionContainer className="py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="max-w-[560px]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Palvelun sisältö</p>
                <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Näet ennen aloittamista, mitä saat.</h2>
                <p className="mt-4 text-base leading-7 text-muted sm:text-lg">{content.summary}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <Card key={feature} className="flex min-h-28 items-start gap-3 p-5 shadow-none">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <p className="font-semibold leading-6">{feature}</p>
                  </Card>
                ))}
              </div>
            </div>
          </SectionContainer>
        </section>

        <section className="border-y border-border bg-cloud">
          <SectionContainer className="py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Kenelle</p>
                <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">{content.audienceTitle}</h2>
                <ul className="mt-8 space-y-4">
                  {content.audience.map((item) => (
                    <li key={item} className="flex gap-3 text-base leading-7 text-muted">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Näin työ etenee</p>
                <ol className="mt-5 divide-y divide-border rounded-xl border border-border bg-surface px-5 sm:px-6">
                  {content.process.map((step, index) => (
                    <li key={step.title} className="grid grid-cols-[44px_1fr] gap-3 py-5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">0{index + 1}</span>
                      <div>
                        <h3 className="font-bold">{step.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </SectionContainer>
        </section>

        <section className="bg-background">
          <SectionContainer className="py-16 md:py-24">
            <div className="max-w-[760px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Usein kysyttyä</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Selkeät vastaukset ennen aloittamista.</h2>
              <div className="mt-8 divide-y divide-border border-y border-border">
                {content.faq.map((item) => (
                  <div key={item.question} className="py-6">
                    <h3 className="font-bold">{item.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted sm:text-base sm:leading-7">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionContainer>
        </section>

        <section className="bg-brand text-white">
          <SectionContainer className="py-16 md:py-20">
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[680px]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/65 sm:text-sm">Seuraava askel</p>
                <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Täytä aloituskysely tilauksen yhteydessä.</h2>
                <p className="mt-4 text-base leading-7 text-white/75">Aloituskysely on tuotekohtainen ja säilyttää tilauksen tunnisteen, kun maksuvaihe liitetään mukaan.</p>
              </div>
              <ButtonLink href={`/alkukysely?product=${product.id}`} className="shrink-0 border-white/20 bg-white text-brand hover:bg-cloud" variant="secondary">Esikatsele kyselyä</ButtonLink>
            </div>
          </SectionContainer>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
