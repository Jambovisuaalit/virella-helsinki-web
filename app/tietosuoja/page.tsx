import type { Metadata } from "next";
import { AnalyticsPreferences } from "@/components/privacy/analytics-preferences";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { businessConfig } from "@/config/business";

export const metadata: Metadata = {
  title: "Tietosuoja",
  description: "Virella Helsingin tietosuoja- ja analytiikkakäytännöt.",
  alternates: { canonical: "/tietosuoja" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <SectionContainer className="py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Tietosuoja</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Tietosuoja ja analytiikka</h1>
            <p className="mt-5 text-base leading-7 text-muted">Tällä sivulla kuvataan, mitä tietoja Virella Helsinki käsittelee verkkosivulla, ostamisen yhteydessä ja palvelun toimittamiseksi.</p>

            <div className="mt-10 space-y-10 text-sm leading-7 text-muted sm:text-base">
              <section>
                <h2 className="text-xl font-bold text-foreground">Rekisterinpitäjä</h2>
                <p className="mt-3">{businessConfig.legalName}, Y-tunnus {businessConfig.businessId}, {businessConfig.city}. Yhteydenotot: <a href={`mailto:${businessConfig.email}`} className="font-semibold text-brand underline underline-offset-4">{businessConfig.email}</a>.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground">Mitä tietoja käsittelemme</h2>
                <p className="mt-3">Palvelun ostamisen ja toimittamisen yhteydessä voimme käsitellä asiakkaan nimeä, sähköpostiosoitetta, yrityksen nimeä, verkkosivun osoitetta, aloituskyselyn vastauksia, tilausta ja maksun tilaa koskevia tietoja sekä palvelun toimittamiseen liittyviä muistiinpanoja.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground">Mihin tietoja käytetään</h2>
                <p className="mt-3">Tietoja käytetään tilauksen käsittelyyn, maksun vahvistamiseen, palvelun toimittamiseen, asiakasviestintään, väärinkäytösten ehkäisyyn sekä lakisääteisten velvoitteiden hoitamiseen. Analytiikkaa käytetään sivuston ja ostopolun kehittämiseen vain käyttäjän suostumuksella.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground">Palveluntarjoajat</h2>
                <p className="mt-3">Sivuston teknisessä toteutuksessa käytetään Verceliä. Tilaus- ja aloituskyselytietoja tallennetaan Supabaseen. Maksut käsitellään Stripen kautta. Suostumuksen perusteella käytettävä verkkosivuanalytiikka toteutetaan Google Analyticsilla. Nämä palveluntarjoajat käsittelevät tietoja omien sopimusehtojensa ja tietosuojakäytäntöjensä mukaisesti.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground">Analytiikka ja evästeet</h2>
                <p className="mt-3">Google Analyticsia ei ladata ennen analytiikkasuostumusta. Voit käyttää sivustoa ja ostaa palvelun myös valitsemalla vain välttämättömät toiminnot. Voit muuttaa analytiikkavalintaasi alla.</p>
                <div className="mt-5"><AnalyticsPreferences /></div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground">Säilytys ja oikeudet</h2>
                <p className="mt-3">Tietoja säilytetään vain niin kauan kuin niitä tarvitaan palvelun toimittamiseen, asiakassuhteen hoitamiseen tai lakisääteisten velvoitteiden täyttämiseen. Voit pyytää tietoa sinua koskevasta käsittelystä, tietojen oikaisua tai poistamista soveltuvan lainsäädännön mukaisesti ottamalla yhteyttä rekisterinpitäjään.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground">Päivitetty</h2>
                <p className="mt-3">12.9.2026</p>
              </section>
            </div>
          </div>
        </SectionContainer>
      </main>
      <SiteFooter />
    </>
  );
}
