import { FunnelEvent } from "@/components/analytics/funnel-event";
import { BuyButton } from "@/components/commerce/buy-button";
import { MobilePurchaseBar } from "@/components/commerce/mobile-purchase-bar";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { PriceDisplay } from "@/components/ui/price-display";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products, type ProductId } from "@/config/products";
import { taxConfig } from "@/config/tax";
import { requiresWrittenOffer } from "@/config/offer-master";
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
  const isLinkedin = productKey === "linkedin";
  const quoteOnly = requiresWrittenOffer(product.id);
  const isQuotedPrice = product.billing === "quote";

  return (
    <>
      <FunnelEvent name="service_view" productId={product.id} />
      <SiteHeader />
      <main className="virella-service-main">
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

              <h1 className="mt-7 ui-heading-hero text-foreground">
                {content.title}
              </h1>

              <p className="mt-7 max-w-[680px] text-[1.03rem] leading-8 text-muted sm:text-[1.14rem]">{content.lead}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <BuyButton productId={product.id} label="Aloita yhteistyö" source="hero" />
                <ButtonLink href="#sisalto" variant="secondary" className="sm:px-6">{isQuotedPrice ? "Katso mitä arvioimme" : "Katso mitä saat"}</ButtonLink>
              </div>

              {isConversionFix ? (
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted">
                  <span>Ei pakollista myyntipalaveria</span>
                  <span className="hidden text-border sm:inline">•</span>
                  <span>Ei salasanoja lomakkeella</span>
                  <span className="hidden text-border sm:inline">•</span>
                  <span>Toimitus sovitaan kirjallisesti</span>
                </div>
              ) : null}
            </div>

            <Card className="ui-service-card relative overflow-hidden">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[5rem] bg-brand/5" aria-hidden="true" />
              <div className="relative">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-brand">{isQuotedPrice ? "Asiakaskohtainen tarjous" : "Vahvistettu hinta"}</p>
                <PriceDisplay className="mt-5" amount={product.price} suffix={product.billing === "month" ? "/ kk" : undefined} />

                {isQuotedPrice ? (
                  <p className="mt-2 text-sm text-muted">{isLinkedin ? "Julkaisumäärä, hinta ja sopimuskausi vahvistetaan kirjallisessa tarjouksessa." : "Korjausten sisältö, hinta ja aikataulu vahvistetaan kirjallisessa tarjouksessa."}</p>
                ) : product.billing === "month" ? (
                  <p className="mt-2 text-sm text-muted">{product.commitmentMonths} kk · yhteensä {euro.format(product.totalPrice)}</p>
                ) : (
                  <p className="mt-2 text-sm text-muted">Kertamaksu</p>
                )}



                <p className={`${isConversionFix ? "mt-5" : "mt-6 border-t border-border/70 pt-5"} text-sm leading-6 text-muted`}>{taxConfig.publicMessage}</p>
                <BuyButton productId={product.id} label="Aloita yhteistyö" className="mt-7" source="pricing_card" />
              </div>
            </Card>
          </SectionContainer>
        </section>

        <section id="sisalto" className="border-y border-border/70 bg-surface/75">
          <SectionContainer className="py-20 sm:py-24 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div className="max-w-[540px]">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">{isQuotedPrice ? "Mitä sovimme" : "Sisältö"}</p>
                <h2 className="mt-4 ui-heading-section">{isQuotedPrice ? "Sisältö määräytyy kirjallisen tarjouksen mukaan." : "Näet ennen tilausta, mitä palveluun kuuluu."}</h2>
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
                <h2 className="mt-4 ui-heading-section">{content.audienceTitle}</h2>
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
                <ol className="mt-7 overflow-hidden ui-card">
                  {content.process.map((step, index) => (
                    <li key={step.title} className="grid grid-cols-[48px_1fr] gap-4 border-b border-border/70 px-5 py-6 last:border-b-0 sm:px-6">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-brand-foreground">0{index + 1}</span>
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
                <h2 className="mt-4 ui-heading-section">Selkeät vastaukset ennen tilausta.</h2>
              </div>
              <div className="ui-card overflow-hidden">
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
            <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-brand px-6 py-10 text-brand-foreground shadow-[var(--shadow-card)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <div className="premium-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
              <div className="relative flex flex-col gap-9 md:flex-row md:items-end md:justify-between">
                <div className="max-w-[720px]">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-foreground/80">{quoteOnly ? "Pyydä kirjallinen tarjous" : "Aloita verkossa"}</p>
                  <h2 className="mt-4 ui-heading-section">{isConversionFix ? "Tee yhteydenotosta asiakkaalle helpompi." : isLinkedin ? "Sovitaan juuri teille sopiva LinkedIn-palvelu." : quoteOnly ? "Lähetä aloituspyyntö. Hyväksy tarjous ennen laskutusta." : "Maksa verkossa ja täytä aloituskysely."}</h2>
                  <p className="mt-5 max-w-[680px] text-base leading-7 text-brand-foreground/80">{isConversionFix ? "Lähetä maksuton aloituspyyntö. Korjausten laajuus, hinta, aikataulu ja mahdolliset käyttöoikeudet sovitaan kirjallisesti ennen työn aloitusta." : isLinkedin ? "Lähetä aloituspyyntö. Määrittelemme julkaisumäärän, hinnan ja työvaiheet kirjallisessa tarjouksessa ennen sitoumusta." : quoteOnly ? "Saat yksilöidyn tarjouksen kirjalliseen hyväksyntään. Lasku lähetetään vasta hyväksynnän jälkeen, ja toteutus alkaa sovittujen maksujen ja materiaalien saavuttua." : "Maksun jälkeen tuotekohtainen aloituskysely avautuu automaattisesti ja toimitus voidaan käynnistää."}</p>
                </div>
                <BuyButton productId={product.id} label={quoteOnly ? "Aloita yhteistyö" : "Aloita tästä"} className="shrink-0" source="final_cta" />
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
