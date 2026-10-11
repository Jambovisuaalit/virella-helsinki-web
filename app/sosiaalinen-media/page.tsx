import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/section-container";
import { SocialPricingCard } from "@/components/marketing/social-pricing-card";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ButtonLink } from "@/components/ui/button";
import { businessConfig } from "@/config/business";
import { products } from "@/config/products";

const euro = new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export const metadata: Metadata = {
  title: "Sosiaalisen median sisällöntuotanto yrityksille",
  description: "Instagram + Facebook ja LinkedIn erillisinä 490 €/kk palveluina. Tutustu sisältöihin ja pyydä aloitusta.",
  alternates: { canonical: "/sosiaalinen-media" },
  openGraph: {
    title: "Sosiaalisen median sisällöntuotanto | Virella Helsinki",
    description: "Sovittu määrä julkaisuja, hyväksyntä ennen julkaisua ja kuukausiraportti.",
    url: "/sosiaalinen-media",
    siteName: businessConfig.brandName,
    locale: "fi_FI",
    type: "website",
  },
  twitter: { card: "summary", title: "Somepalvelu yrityksille | Virella Helsinki" },
};

const steps = [
  {
    number: "01",
    title: "Sinä kerrot yrityksestäsi.",
    text: "Valitse Instagram + Facebook -paketti tai LinkedIn-palvelu. Toimita lähtötiedot, kuvat ja tarvittavat käyttöoikeudet.",
  },
  {
    number: "02",
    title: "Me tuotamme sisällöt.",
    text: "Suunnittelemme aiheet ja toteutamme julkaisut. Saat sisällöt tarkistettavaksi ja hyväksyt ne ennen julkaisua.",
  },
  {
    number: "03",
    title: "Sisällöt julkaistaan.",
    text: "Julkaisemme sovitun suunnitelman mukaan ja toimitamme kuukausiraportin. Sinä keskityt yrityksesi arkeen.",
  },
] as const;

const sampleCalendar = [
  { week: "01", topic: "Työnäyte", description: "Näytä valmis työ tai toteutus" },
  { week: "02", topic: "Palveluesittely", description: "Kerro, mitä asiakkaalle tehdään" },
  { week: "03", topic: "Tekemisen arki", description: "Avaa työtapaa ja osaamista" },
  { week: "04", topic: "Usein kysyttyä", description: "Vastaa asiakkaan tavalliseen kysymykseen" },
] as const;

export default function SocialMediaPage() {
  const product = products.instagram;
  return (
    <div className="landing-page social-landing">
      <a className="landing-skip-link" href="#main-content">Siirry sisältöön</a>
      <SiteHeader landing />
      <main id="main-content">
        <section className="landing-hero" aria-labelledby="hero-title">
          <SectionContainer>
            <p className="landing-eyebrow">Instagram + Facebook tai LinkedIn yrityksellesi</p>
            <h1 id="hero-title">
              Yrityksesi some <span>hoidettuna.</span><br />
              Sinä keskityt asiakkaisiin.
            </h1>
            <p className="landing-lead">
              Virella suunnittelee, kirjoittaa ja julkaisee yrityksesi somejulkaisut.
              Valitse sinulle sopiva kanava ja hyväksy sisällöt ennen julkaisua.
            </p>
            <ButtonLink href="#hinnoittelu" className="landing-primary">Katso palvelut ja hinnat</ButtonLink>
            <p className="landing-hero-price">
              Alkaen <strong>{euro.format(product.price)} / kk</strong>
              <span aria-hidden="true">·</span>{product.commitmentMonths} kk vähimmäisjakso
            </p>
            <a href="#todisteet" className="landing-text-link">Katso konkreettinen esimerkki</a>
          </SectionContainer>
        </section>

        <section id="todisteet" className="virella-section-block border-y border-zinc-800 bg-zinc-950" aria-labelledby="proof-title">
          <SectionContainer>
            <div className="grid items-start gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
              <div>
                <p className="virella-section-eyebrow">
                  Konkreettinen toimitus
                </p>
                <h2 id="proof-title" className="virella-section-title text-zinc-100">
                  Mitä yrityksesi oikeasti saa?
                </h2>
                <p className="virella-section-copy max-w-lg">
                  Näet esimerkin sisältöteemoista ja tiedät, mitä valitsemaasi palveluun kuuluu.
                  Instagram + Facebook ja LinkedIn ovat erillisiä kokonaisuuksia.
                </p>
                <div className="mt-7 grid grid-cols-2 gap-4 border-t border-zinc-800 pt-6">
                  <div>
                    <p className="font-mono text-3xl text-zinc-100">12</p>
                    <p className="mt-1 text-sm text-zinc-400">Julkaisua / 30 päivää, Instagram + Facebook</p>
                  </div>
                  <div>
                    <p className="font-mono text-3xl text-zinc-100">1</p>
                    <p className="mt-1 text-sm text-zinc-400">Koottu korjauskierros</p>
                  </div>
                </div>
                <p className="mt-6 text-xs leading-5 text-zinc-400">
                  Alla on havainnollistava sisältökalenterin esimerkki, ei
                  asiakkaan referenssi tai toteutunut tulos.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8" aria-label="Esimerkki kuukausittaisesta sisältösuunnitelmasta">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-400">
                      Sisältösuunnitelma · esimerkki
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-100">
                      Kuukauden sisältöteemat
                    </h3>
                  </div>
                  <p className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
                    4 viikon näkymä
                  </p>
                </div>
                <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                  {sampleCalendar.map((entry) => (
                    <li key={entry.week} className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <span className="font-mono text-xs text-zinc-400">VIIKKO {entry.week}</span>
                      <p className="mt-2 font-semibold text-zinc-100">{entry.topic}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{entry.description}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 text-xs leading-5 text-zinc-400">
                  Todelliset aiheet sovitaan yrityksesi palvelujen ja materiaalien perusteella.
                </p>
              </div>
            </div>
          </SectionContainer>
        </section>

        <section id="prosessi" className="landing-process virella-section-block" aria-labelledby="process-title">
          <SectionContainer>
            <div className="landing-section-intro">
              <div>
                <p className="landing-eyebrow virella-section-eyebrow">Näin se toimii</p>
                <h2 id="process-title" className="virella-section-title">Selkeä prosessi.<br />Sinä hyväksyt sisällöt.</h2>
              </div>
              <p>
                Jokainen kuukausi etenee sovitun suunnitelman ja aikataulun mukaan.
              </p>
            </div>
            <ol className="landing-steps">
              {steps.map((step) => (
                <li key={step.number}>
                  <span className="landing-step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>

          </SectionContainer>
        </section>

        <section id="hinnoittelu" className="landing-pricing virella-section-block" aria-labelledby="pricing-title">
          <SectionContainer>
            <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
              <p className="landing-eyebrow virella-section-eyebrow">Selkeä hinta. Selkeä sisältö.</p>
              <h2 id="pricing-title" className="virella-section-title">Valitse yrityksellesi sopiva kanava.</h2>
              <p className="virella-section-copy mx-auto max-w-2xl">
                Vertaa Instagram + Facebook- ja LinkedIn-palveluja rinnakkain.
              </p>
            </div>
            <SocialPricingCard />
            <div className="landing-faq mx-auto mt-16 max-w-3xl sm:mt-20">
              <h3 className="mb-5 text-xl font-semibold text-zinc-100">Usein kysyttyä</h3>
              <details>
                <summary>Kuuluvatko molemmat kanavat hintaan?</summary>
                <p>Instagram-paketti sisältää Instagramin ja Facebookin. LinkedIn on erillinen palvelu, eikä kuulu Instagram-paketin hintaan.</p>
              </details>
              <details>
                <summary>Kuinka pitkä sopimus on?</summary>
                <p>Molemmissa paketeissa vähimmäisjakso on {product.commitmentMonths} kuukautta. Kummankin hinta on {euro.format(product.price)} kuukaudessa, yhteensä {euro.format(product.totalPrice)}. Maksutapa ja jatkon ehdot vahvistetaan ennen aloitusta.</p>
              </details>
              <details>
                <summary>Mitä minulta tarvitaan?</summary>
                <p>Yrityksen lähtötiedot, käytettävissä olevat kuva- ja videomateriaalit sekä julkaisun vaatimat käyttöoikeudet. Tarkistat ja hyväksyt sisällöt ennen julkaisua.</p>
              </details>
              <details>
                <summary>Miten tuloksia seurataan?</summary>
                <p>Saat kuukausiraportin valitun kanavan näkyvyydestä ja sisältöjen toimivuudesta. Sisältöä kehitetään havaintojen perusteella. Tiettyä seuraaja-, yhteydenotto- tai myyntimäärää ei luvata.</p>
              </details>
            </div>
          </SectionContainer>
        </section>

        <section id="yhteys" className="landing-contact virella-section-block" aria-labelledby="contact-title">
          <SectionContainer className="landing-contact-layout">
            <div>
              <p className="landing-eyebrow virella-section-eyebrow">Virella Helsinki</p>
              <h2 id="contact-title" className="virella-section-title">Yrityksesi some selkeästi hoidettuna.</h2>
              <p>Vertaile kahta palvelua tai kysy, kumpi kanava sopii yrityksellesi.</p>
            </div>
            <div className="landing-contact-actions">
              <ButtonLink href="#hinnoittelu" className="landing-primary">Katso palvelut ja hinnat</ButtonLink>
              <a href={`tel:${businessConfig.phoneE164}`}>{businessConfig.phone}</a>
            </div>
          </SectionContainer>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
