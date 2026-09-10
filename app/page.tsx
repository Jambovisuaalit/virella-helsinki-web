import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ButtonLink } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <SectionContainer className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Virella Helsinki
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Uusi verkkosivusto on kehityksessä.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Tämä on uuden Virella Helsinki -sovelluksen tekninen perusta. Lopullinen markkinointisisältö rakennetaan erikseen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#foundation">Tarkista perusta</ButtonLink>
            </div>
          </div>
        </SectionContainer>
        <SectionContainer id="foundation" className="pb-24 sm:pb-32">
          <div className="rounded-3xl border border-border bg-surface p-8 sm:p-10">
            <h2 className="text-2xl font-semibold">Deployment-ready foundation</h2>
            <p className="mt-3 max-w-2xl text-muted">
              Next.js App Router, TypeScript, Tailwind CSS, ESLint, CI-tarkistukset ja turvallinen noindex-oletus Vercel-previewta varten.
            </p>
          </div>
        </SectionContainer>
      </main>
      <SiteFooter />
    </>
  );
}
