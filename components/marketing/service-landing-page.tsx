import { FunnelEvent } from "@/components/analytics/funnel-event";
import { BuyButton } from "@/components/commerce/buy-button";
import { MobilePurchaseBar } from "@/components/commerce/mobile-purchase-bar";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products, type ProductId } from "@/config/products";
import { taxConfig } from "@/config/tax";
import { servicePageContent } from "@/content/fi/services";

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
  const isConversionFix = productKey === "websiteFix";

  return (
    <>
      <FunnelEvent name="service_view" productId={product.id} />
      <SiteHeader />
      <main className="pb-28 md:pb-0">
        <section className="relative overflow-hidden pb-14 pt-8 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-16">
          {isConversionFix ? <div className="premium-grid pointer-events-none absolute inset-0 -z-20" aria-hidden="true" /> : null}
          <div className="pointer-events-none absolute right-[-9rem] top-[-7rem] -z-10 h-96 w-96 rounded-full bg-brand/8 blur-3xl" aria-hidden="true" />
          {isConversionFix ? <div className="pointer-events-none absolute -left-20 bottom-0 -z-10 h-64 w-64 rounded-full bg-accent/7 blur-3xl" aria-hidden="true" /> : null}

          <SectionContainer className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
            <div className="max-w-[760px]">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-brand/15 bg-surface/80 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.17em] text-brand shadow-[0_10px_26px_-22px_rgba(23,33,38,0.45)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {content.eyebrow}
              </div>

              <h1 className={`mt-7 font-extrabold leading-[0.96] tracking-[-0.06em] text-foreground ${isConversionFix ? "text-[3.1rem] sm:text-[4.25rem] lg:text-[4.9rem]" : "text-[2.8rem] sm:text-5xl lg:text-[4.25rem]"}`}>
                {content.title}
              </h1>

              <p className="mt-7 max-w-[680px] text-[1.03rem] leading-8 text-muted sm:text-[1.14rem]">{content.lead}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <BuyButton productId={product.id} label={`Osta ${product.name}`} source="hero" />
                <ButtonLink href="#sisalto" variant="secondary" className="sm:px-6">Katso mitä saat</ButtonLink>
              </div>

              {isConversionFix ? (
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted">
                  <span>Ei myyntipalaveripakkoa</span>
                  <span className="hidden text-border sm:inline">•</span>
                  <span>Ei salasanoja lomakkeella</span>
                  <span className="hidden text-border sm:inline">•</span>
                  <span>Yksi korjauskierros</span>
                </div>
              ) : null}
            </div>

            <Card className="soft-ring relative overflow-hidden border-white/80 bg-surface/95 p-6 shadow-[0_34px_90px_-46px_rgba(23,33,38,0.48)] backdrop-blur sm:p-8">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[5rem] bg-brand/5" aria-hidden="true" />
              <div className="relative">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-brand">{isConversionFix ? "Conversion Fix" : "Kiinteä hinta"}</p>
                <div className="mt-5 flex items-end gap-2">
                  <p className="text-5xl font-extrabold tracking-[-0.055em] text-foreground">{euro.format(product.price)}</p>
                  {product.billing === "month" ? <p className="pb-1 text-sm font-semibold text-muted">/ kk</p> : null}
                </div>

                {product.billing === "month" ? (
                  <p className="mt-2 text-sm text-muted">{product.commitmentMonths} kk · yhteensä {euro.format(product.totalPrice)}</p>
                ) : (
                  <p className="mt-2 text-sm text-muted">Kertamaksu</p>
                )}

                {isConversionFix ? (
                  <div className="mt-7 grid grid-cols-3 gap-2 border-y border-border/70 py-5 text-center">
                    <div><p className="text-xl font-extrabold tracking-[-0.04em] text-brand">72 h</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.09em] text-muted">toimitus</p></div>
                    <div><p className="text-xl font-extrabold tracking-[-0.04em] text-brand">8</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.09em] text-muted">scope-kohtaa</p></div>
                    <div><p className="text-xl font-extrabold tracking-[-0.04em] text-brand">1</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.09em] text-muted">kierros</p></div>
                  </div>
                ) : null}

                <p className={`${isConversionFix ? "mt-5" : "mt-6 border-t border-border/70 pt-5"} text-sm leading-6 text-muted`}>{taxConfig.publicMessage}</p>
                <BuyButton productId={product.id} label={isConversionFix ? "Osta Conversion Fix" : undefined} className="mt-7" source="pricing_card" />
              </div>
            </Card>
          </SectionContainer>
        </section>

        <section id="sisalto" className="border-y border-border/70 bg-surface/75">
          <SectionContainer className="py-20 sm:py-24 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div className="max-w-[540px]">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">Selkeä scope</p>
                <h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-5xl">{isConversionFix ? "Mitä 690 € toimitukseen kuuluu." : "Näet ennen ostamista, mitä palveluun kuuluu."}</h2>
                <p className="mt-5 text-base leading-7 text-muted sm:text-lg">{content.summary}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {product.features.map((feature, index) => (
                  <Card key={feature} className="group flex min-h-32 items-start gap-4 p-5 shadow-none transition duration-200 hover:-translate-y-0.5 hover:border-brand/15 hover:bg-background sm:p-6">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/7 text-[10px] font-extrabold text-brand">{String(index + 1).padStart(2, "0")}</span>
                    <p className="pt-1 font-bold leading-6 tracking-[-0.01em] text-foreground">{feature}</p>
                  </Card>
                ))}
              </div>
            </div>
          </SectionContainer>
        </section>

        <section className="bg-background">
          <SectionContainer className="py-20 sm:py-24 lg:py-28">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">Kenelle</p>
                <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">{content.audienceTitle}</h2>
                <ul className="mt-9 space-y-4">
                  {content.audience.map((item) => (
                    <li key={item} className="flex gap-4 rounded-[1.2rem] border border-border/70 bg-surface/70 px-5 py-4 text-base leading-7 text-muted">
                      <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">Näin työ etenee</p>
                <ol className="mt-7 overflow-hidden rounded-[1.6rem] border border-border/80 bg-surface shadow-[0_24px_70px_-48px_rgba(23,33,38,0.42)]">
                  {content.process.map((step, index) => (
                    <li key={step.title} className="grid grid-cols-[48px_1fr] gap-4 border-b border-border/70 px-5 py-6 last:border-b-0 sm:px-6">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-white">0{index + 1}</span>
                      <div>
                        <h3 className="font-extrabold tracking-[-0.015em] text-foreground">{step.title}</h3>
                        <p className="mt-1.5 text-sm leading-6 text-muted">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </SectionContainer>
        </section>

        <section className="bg-cloud/60">
          <SectionContainer className="py-20 sm:py-24 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.55fr_1fr] lg:gap-16">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">Usein kysyttyä</p>
                <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">Selkeät vastaukset ennen ostamista.</h2>
              </div>
              <div className="overflow-hidden rounded-[1.6rem] border border-border/80 bg-surface">
                {content.faq.map((item) => (
                  <div key={item.question} className="border-b border-border/70 px-5 py-6 last:border-b-0 sm:px-7">
                    <h3 className="font-extrabold tracking-[-0.015em] text-foreground">{item.question}</h3>
                    <p className="mt-2.5 text-sm leading-6 text-muted sm:text-base sm:leading-7">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionContainer>
        </section>

        <section className="bg-background py-16 sm:py-20 lg:py-24">
          <SectionContainer>
            <div className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-10 text-white shadow-[0_34px_100px_-56px_rgba(23,33,38,0.55)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <div className="premium-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
              <div className="relative flex flex-col gap-9 md:flex-row md:items-end md:justify-between">
                <div className="max-w-[720px]">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/60">{isConversionFix ? "Conversion Fix · 690 € · 72 h" : "Aloita verkossa"}</p>
                  <h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-5xl">{isConversionFix ? "Korjaa ensin se, mikä estää asiakasta ottamasta yhteyttä." : "Maksa verkossa ja täytä aloituskysely."}</h2>
                  <p className="mt-5 max-w-[680px] text-base leading-7 text-white/70">{isConversionFix ? "Toimitus alkaa, kun maksu, aloituskysely ja toteutukseen tarvittavat käyttöoikeudet tai materiaalit ovat käytettävissä." : "Maksun jälkeen tuotekohtainen aloituskysely avautuu automaattisesti ja toimitus voidaan käynnistää."}</p>
                </div>
                <BuyButton productId={product.id} label={isConversionFix ? "Osta Conversion Fix · 690 €" : "Osta nyt"} className="shrink-0" source="final_cta" />
              </div>
            </div>
          </SectionContainer>
        </section>
      </main>
      <MobilePurchaseBar currentProduct={productKey} />
      <SiteFooter />
    </>
  );
}
