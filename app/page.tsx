import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ButtonLink } from "@/components/ui/button";

const serviceAreas = [
  {
    title: "Instagram",
    text: "Jatkuva sisältöpalvelu yritykselle, joka haluaa pitää näkyvyyden kunnossa ilman omaa markkinointitiimiä.",
  },
  {
    title: "LinkedIn",
    text: "Selkeä B2B-sisältömalli asiantuntijoille ja palveluyrityksille, jotka haluavat näkyä johdonmukaisesti.",
  },
  {
    title: "Landing Page + SEO",
    text: "Nopea, selkeä ja hakukoneystävällinen laskeutumissivu, jonka tehtävä on ohjata kävijä seuraavaan toimintaan.",
  },
];

const principles = [
  ["Teal", "Brändi ja luottamus", "bg-brand"],
  ["Coral", "Toiminta ja ostopiste", "bg-accent"],
  ["Canvas", "Tila ja rauha", "bg-background border border-border"],
] as const;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="overflow-hidden border-b border-border">
          <SectionContainer className="grid gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24 lg:gap-20">
            <div className="max-w-[720px]">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">
                Markkinointi valmiina palveluna
              </p>
              <h1 className="max-w-[760px] text-[2.55rem] font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-[3.75rem]">
                Ulkoista markkinointi. Pidä fokus liiketoiminnassa.
              </h1>
              <p className="mt-6 max-w-[680px] text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Virella tekee markkinoinnista selkeän palvelun: ymmärrettävä sisältö, rauhallinen käyttöliittymä ja yksi selkeä seuraava askel.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#services">Katso palvelumalli</ButtonLink>
                <ButtonLink href="#foundation" variant="secondary">
                  Tutustu designiin
                </ButtonLink>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
              <div className="absolute -right-6 bottom-8 h-40 w-40 rounded-full bg-brand/10 blur-3xl" aria-hidden="true" />
              <div className="relative rounded-[20px] border border-border bg-surface p-5 shadow-[0_8px_40px_-12px_rgba(31,36,46,0.12)] sm:p-7">
                <div className="flex items-center justify-between border-b border-border pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Virella system</p>
                    <p className="mt-1 text-sm text-muted">Yksi selkeä palvelupolku</p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-success" aria-label="Järjestelmä valmis" />
                </div>

                <ol className="mt-3 divide-y divide-border">
                  {[
                    ["01", "Valitse palvelu", "Näet heti mitä olet ostamassa."],
                    ["02", "Käynnistä työ", "Aloitus etenee yhden selkeän polun kautta."],
                    ["03", "Pidä fokus", "Markkinointi jää pois omalta tehtävälistalta."],
                  ].map(([number, title, text]) => (
                    <li key={number} className="grid grid-cols-[44px_1fr] gap-3 py-5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cloud text-xs font-bold text-brand">
                        {number}
                      </span>
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </SectionContainer>
        </section>

        <section id="services" className="bg-surface">
          <SectionContainer className="py-16 md:py-24">
            <div className="max-w-[720px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Palvelumalli</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                Digitaalisen tuotteen selkeys. Ihmisen tekemän palvelun laatu.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
                Jokaisen palvelun pitää vastata nopeasti kolmeen asiaan: mitä saat, mitä seuraavaksi tapahtuu ja miten työ käynnistyy.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {serviceAreas.map((service, index) => (
                <article
                  key={service.title}
                  className="group rounded-xl border border-border bg-background p-6 transition hover:-translate-y-1 hover:shadow-[0_12px_44px_-18px_rgba(31,36,46,0.20)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-brand">0{index + 1}</span>
                    <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  </div>
                  <h3 className="mt-8 text-xl font-bold tracking-[-0.025em]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{service.text}</p>
                  <p className="mt-8 text-sm font-semibold text-brand">Rakenteilla →</p>
                </article>
              ))}
            </div>
          </SectionContainer>
        </section>

        <section id="foundation" className="border-y border-border bg-cloud">
          <SectionContainer className="py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">Design foundation</p>
                <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                  Modern Nordic B2B ilman agency-kohinaa.
                </h2>
              </div>
              <p className="max-w-[680px] text-base leading-7 text-muted lg:justify-self-end">
                Warm Canvas antaa tilaa, Teal rakentaa tunnistettavuuden ja Coral ohjaa toimintaan. Typografia on vahva, layout rauhallinen ja komponentit suunnitellaan ensin mobiiliin.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {principles.map(([name, role, color]) => (
                <div key={name} className="rounded-xl border border-border bg-surface p-4">
                  <div className={`h-28 rounded-lg ${color}`} aria-hidden="true" />
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <p className="font-semibold">{name}</p>
                    <p className="text-right text-xs leading-5 text-muted">{role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-3 sm:p-6">
              {[
                ["Mobile-first", "320 px alkaen"],
                ["Server-first", "Minimoi client JS"],
                ["Preview-safe", "noindex, nofollow"],
              ].map(([title, value]) => (
                <div key={title} className="border-b border-border pb-4 last:border-0 last:pb-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5 sm:last:border-r-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">{title}</p>
                  <p className="mt-2 text-sm text-muted">{value}</p>
                </div>
              ))}
            </div>
          </SectionContainer>
        </section>

        <section className="bg-brand text-white">
          <SectionContainer className="py-16 md:py-20">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[680px]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/65 sm:text-sm">Seuraava vaihe</p>
                <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                  Design system on valmis kasvamaan sivu kerrallaan.
                </h2>
                <p className="mt-4 text-base leading-7 text-white/70">
                  Seuraavaksi sama rakenne voidaan viedä palvelusivuihin ilman, että brändi tai käyttölogiikka muuttuu jokaisessa toteutusvaiheessa.
                </p>
              </div>
              <ButtonLink href="#services" className="shrink-0 border-white/20 bg-white text-brand hover:bg-cloud" variant="secondary">
                Takaisin palvelumalliin
              </ButtonLink>
            </div>
          </SectionContainer>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
