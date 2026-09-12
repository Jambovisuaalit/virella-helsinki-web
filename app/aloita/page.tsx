import type { Metadata } from "next";
import Link from "next/link";
import { FunnelEvent } from "@/components/analytics/funnel-event";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { products } from "@/config/products";
import { getProductKeyById } from "@/lib/stripe/stripe-api";

export const metadata: Metadata = {
  title: "Aloita projekti | Virella Helsinki",
  description: "Lähetä Virella Helsingille projektin lähtötiedot ja aloita keskustelu.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type StartPageProps = {
  searchParams: Promise<{
    product?: string | string[];
    submitted?: string | string[];
    error?: string | string[];
    checkout_error?: string | string[];
  }>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const fieldClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15";

export default async function StartPage({ searchParams }: StartPageProps) {
  const params = await searchParams;
  const productId = first(params.product) ?? "";
  const submitted = first(params.submitted) === "1";
  const error = first(params.error);
  const checkoutError = first(params.checkout_error) === "1";
  const productKey = productId ? getProductKeyById(productId) : undefined;
  const product = productKey ? products[productKey] : undefined;

  return (
    <>
      {submitted ? <FunnelEvent name="contact_submit" productId={productId || undefined} source="project_intake" /> : null}
      <SiteHeader />
      <main className="bg-background">
        <SectionContainer className="py-14 sm:py-18 md:py-24">
          <div className="mx-auto grid max-w-[980px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Aloita projekti</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-5xl">
                {submitted ? "Kiitos. Pyyntö on vastaanotettu." : product ? `Aloita ${product.name}.` : "Kerro mitä haluat saada kuntoon."}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                {submitted
                  ? "Virella sai lähtötietosi. Palaamme asiaan sähköpostilla seuraavaa askelta varten."
                  : "Lähetä tärkeimmät lähtötiedot. Saat vastauksen sähköpostilla ilman erillistä myyntipalaveria tai pitkää tarjousprosessia."}
              </p>

              {!submitted ? (
                <div className="mt-8 space-y-3 text-sm leading-6 text-muted">
                  <p className="rounded-xl border border-border bg-surface p-4">1. Kerro yritys, verkkosivu ja tärkein tavoite.</p>
                  <p className="rounded-xl border border-border bg-surface p-4">2. Arvioimme sopiiko rajattu toteutus tilanteeseesi.</p>
                  <p className="rounded-xl border border-border bg-surface p-4">3. Saat selkeän seuraavan askeleen sähköpostilla.</p>
                </div>
              ) : null}
            </div>

            <div className="rounded-[22px] border border-border bg-surface p-5 shadow-[0_18px_55px_-30px_rgba(31,36,46,0.24)] sm:p-8">
              {submitted ? (
                <div>
                  <p className="text-sm font-bold text-brand">Lähetys onnistui.</p>
                  <p className="mt-3 text-sm leading-6 text-muted">Voit sulkea sivun tai palata etusivulle.</p>
                  <Link href="/" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-action px-5 py-3 text-sm font-bold text-white">
                    Takaisin etusivulle
                  </Link>
                </div>
              ) : (
                <form action="/api/contact" method="post" className="space-y-5">
                  {productId ? <input type="hidden" name="productId" value={productId} /> : null}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="companyWebsite">Jätä tämä kenttä tyhjäksi</label>
                    <input id="companyWebsite" name="companyWebsite" tabIndex={-1} autoComplete="off" />
                  </div>

                  {product ? (
                    <div className="rounded-xl border border-brand/15 bg-brand/5 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Palvelu</p>
                      <p className="mt-1 font-bold">{product.name}</p>
                    </div>
                  ) : null}

                  {checkoutError ? (
                    <p className="rounded-xl border border-border bg-cloud p-4 text-sm leading-6 text-muted">
                      Verkkomaksua ei käynnistetty. Lähetä lähtötiedot tästä, niin jatkamme sähköpostilla.
                    </p>
                  ) : null}
                  {error ? (
                    <p className="rounded-xl border border-action/20 bg-action/5 p-4 text-sm font-semibold text-action">
                      Lähetys ei onnistunut. Tarkista pakolliset kentät ja yritä uudelleen.
                    </p>
                  ) : null}

                  <div>
                    <label htmlFor="name" className="text-sm font-bold">Nimi *</label>
                    <input id="name" name="name" required maxLength={120} autoComplete="name" className={fieldClassName} />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-bold">Sähköposti *</label>
                    <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={fieldClassName} />
                  </div>
                  <div>
                    <label htmlFor="company" className="text-sm font-bold">Yritys</label>
                    <input id="company" name="company" maxLength={160} autoComplete="organization" className={fieldClassName} />
                  </div>
                  <div>
                    <label htmlFor="website" className="text-sm font-bold">Verkkosivu</label>
                    <input id="website" name="website" type="url" maxLength={300} placeholder="https://" className={fieldClassName} />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-bold">Mitä haluat saada kuntoon? *</label>
                    <textarea id="message" name="message" required maxLength={2000} rows={6} className={fieldClassName} />
                  </div>

                  <p className="text-xs leading-5 text-muted">
                    Lähettämällä lomakkeen hyväksyt, että tietoja käytetään yhteydenottoon. Katso <Link href="/tietosuoja" className="font-semibold text-brand underline underline-offset-2">tietosuojaseloste</Link>.
                  </p>

                  <button type="submit" className="min-h-12 w-full rounded-full bg-action px-5 py-3 text-sm font-bold text-white transition hover:brightness-95 sm:w-auto">
                    Lähetä aloituspyyntö
                  </button>
                </form>
              )}
            </div>
          </div>
        </SectionContainer>
      </main>
      <SiteFooter />
    </>
  );
}
