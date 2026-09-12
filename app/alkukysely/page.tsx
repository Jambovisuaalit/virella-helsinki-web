import type { Metadata } from "next";
import Link from "next/link";
import { FunnelEvent } from "@/components/analytics/funnel-event";
import { QuestionnaireForm } from "@/components/forms/questionnaire-form";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getQuestionnaireByProductId } from "@/config/questionnaires";
import { getCheckoutSession } from "@/lib/stripe/stripe-api";

export const metadata: Metadata = {
  title: "Aloituskysely",
  description: "Virella Helsingin palvelukohtainen aloituskysely.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type QuestionnairePageProps = {
  searchParams: Promise<{
    product?: string | string[];
    session_id?: string | string[];
    submitted?: string | string[];
  }>;
};

const serviceLinks = [
  ["Conversion Fix", "/verkkosivu-kuntoon"],
  ["Instagram", "/instagram"],
  ["LinkedIn", "/linkedin"],
  ["Landing Page + SEO", "/landing-page-seo"],
] as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function QuestionnairePage({ searchParams }: QuestionnairePageProps) {
  const params = await searchParams;
  const sessionId = first(params.session_id);
  const submitted = first(params.submitted) === "1";
  let productId = first(params.product);
  let orderValid = false;

  if (sessionId) {
    try {
      const session = await getCheckoutSession(sessionId);
      productId = session.metadata?.productId;
      orderValid = session.payment_status === "paid" && Boolean(productId);
    } catch (error) {
      console.error("Questionnaire order lookup failed", error);
    }
  }

  const questionnaire = productId ? getQuestionnaireByProductId(productId) : undefined;
  const trackedProductId = orderValid && questionnaire ? questionnaire.productId : undefined;

  return (
    <>
      {trackedProductId ? (
        <FunnelEvent
          name={submitted ? "questionnaire_completed" : "questionnaire_started"}
          productId={trackedProductId}
        />
      ) : null}
      <SiteHeader />
      <main>
        <SectionContainer className="py-14 md:py-24">
          {submitted && questionnaire ? (
            <div className="mx-auto max-w-[720px] rounded-[20px] border border-border bg-surface p-6 shadow-[0_8px_40px_-12px_rgba(31,36,46,0.12)] sm:p-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-white" aria-hidden="true">✓</div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-brand">Valmis</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em]">Aloituskysely vastaanotettu.</h1>
              <p className="mt-5 text-base leading-7 text-muted">Kiitos. {questionnaire.title} on tallennettu tilauksellesi ja tarvittavat lähtötiedot ovat nyt Virellalla.</p>
              <Link href="/" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold text-brand">Takaisin etusivulle</Link>
            </div>
          ) : questionnaire ? (
            <div className="mx-auto grid max-w-[960px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Aloituskysely</p>
                <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-5xl">{questionnaire.title}</h1>
                <p className="mt-5 text-base leading-7 text-muted sm:text-lg">{questionnaire.description}</p>
                <div className="mt-6 rounded-xl border border-border bg-cloud p-4 text-sm leading-6 text-muted">
                  {orderValid
                    ? "Maksu on vahvistettu. Täytä alla olevat lähtötiedot, jotta työ voidaan aloittaa mahdollisimman suoraan."
                    : "Aloituskysely tallennetaan vasta maksetun tilauksen yhteydessä. Voit tutustua kysymyksiin ennen ostoa."}
                </div>
              </div>

              <div className="rounded-[20px] border border-border bg-surface p-5 shadow-[0_8px_40px_-12px_rgba(31,36,46,0.12)] sm:p-8">
                <QuestionnaireForm questionnaire={questionnaire} sessionId={orderValid ? sessionId : undefined} />
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-[760px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Aloituskysely</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-5xl">Valitse palvelu ennen aloituskyselyä.</h1>
              <p className="mt-5 text-base leading-7 text-muted sm:text-lg">Jokaisella palvelulla on oma lyhyt aloituskysely, jotta lähtötiedot pysyvät selkeinä.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {serviceLinks.map(([label, href]) => (
                  <Link key={href} href={href} className="rounded-xl border border-border bg-surface p-4 font-bold text-brand transition hover:border-brand/30 hover:bg-cloud">{label}</Link>
                ))}
              </div>
            </div>
          )}
        </SectionContainer>
      </main>
      <SiteFooter />
    </>
  );
}
