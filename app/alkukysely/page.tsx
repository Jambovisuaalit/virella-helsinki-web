import type { Metadata } from "next";
import Link from "next/link";
import { QuestionnaireForm } from "@/components/forms/questionnaire-form";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getQuestionnaireByProductId } from "@/config/questionnaires";

export const metadata: Metadata = {
  title: "Aloituskysely | Virella Helsinki",
  description: "Virella Helsingin palvelukohtainen aloituskysely.",
  robots: {
    index: false,
    follow: false,
  },
};

type QuestionnairePageProps = {
  searchParams: Promise<{
    product?: string | string[];
    order?: string | string[];
  }>;
};

const serviceLinks = [
  ["Instagram", "/instagram"],
  ["LinkedIn", "/linkedin"],
  ["Landing Page + SEO", "/landing-page-seo"],
] as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function QuestionnairePage({ searchParams }: QuestionnairePageProps) {
  const params = await searchParams;
  const productId = first(params.product);
  const orderId = first(params.order);
  const questionnaire = productId ? getQuestionnaireByProductId(productId) : undefined;

  return (
    <>
      <SiteHeader />
      <main>
        <SectionContainer className="py-16 md:py-24">
          {questionnaire ? (
            <div className="mx-auto grid max-w-[960px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Aloituskysely</p>
                <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-5xl">{questionnaire.title}</h1>
                <p className="mt-5 text-base leading-7 text-muted sm:text-lg">{questionnaire.description}</p>
                <p className="mt-6 rounded-xl border border-border bg-cloud p-4 text-sm leading-6 text-muted">
                  Tämä kysely käyttää tuotetunnistetta <strong className="text-foreground">{questionnaire.productId}</strong>. Maksuvaihe lisää lisäksi tilauksen tunnisteen osoitteen <strong className="text-foreground">order</strong>-parametriin.
                </p>
              </div>

              <div className="rounded-[20px] border border-border bg-surface p-5 shadow-[0_8px_40px_-12px_rgba(31,36,46,0.12)] sm:p-8">
                <QuestionnaireForm questionnaire={questionnaire} orderId={orderId} />
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-[720px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Aloituskysely</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-5xl">Valitse palvelu ennen aloituskyselyä.</h1>
              <p className="mt-5 text-base leading-7 text-muted sm:text-lg">Aloituskysely on aina sidottu yhteen Virella-palveluun. Avaa ensin oikea palvelusivu.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {serviceLinks.map(([label, href]) => (
                  <Link key={href} href={href} className="rounded-xl border border-border bg-surface p-4 font-bold text-brand transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-16px_rgba(31,36,46,0.18)]">
                    {label}
                  </Link>
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
