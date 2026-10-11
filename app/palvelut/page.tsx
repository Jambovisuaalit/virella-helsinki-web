import type { Metadata } from "next";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { serviceCatalog } from "@/config/service-catalog";
import { taxConfig } from "@/config/tax";

export const metadata: Metadata = {
  title: "Palvelut ja hinnat", description: "Virella Helsingin palvelut, hinnat ja toimitusrajaukset. Näkyvyys, Landing Page + SEO, Löydettävyys, Liidit ja verkkosivut.",
  alternates: { canonical: "/palvelut" },
};
export default function ServicesPage() {
  return <><SiteHeader /><main><SectionContainer className="py-14 sm:py-20">
    <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-widest text-brand">Virella Helsinki</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Palvelut ja hinnat</h1>
      <p className="mt-6 text-lg leading-8 text-muted">Valitse tavoitteeseesi sopiva palvelu. Lähetämme yksilöidyn tarjouksen, jossa sovitaan toimitus, kokonaishinta, maksuerät ja sopimuskausi. Aloituspyyntö ja maksuton kartoitus eivät ole tilauksia.</p>
      <p className="mt-4 leading-7 text-muted">{taxConfig.publicMessage}</p>
      <Link href="/sopimusehdot" className="mt-4 inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4">Tutustu sopimusehtoihin ja hyväksyntäkäytäntöön</Link>
    </div>
    <div className="mt-10 grid gap-6 lg:grid-cols-2">{serviceCatalog.map(service => <article key={service.name} className="min-w-0 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight">{service.name}</h2>
      <p className="mt-4 text-2xl font-extrabold text-brand">{service.price}</p>
      <p className="mt-4 text-sm leading-7 text-muted">{service.terms}</p>
      <h3 className="mt-6 font-bold">Toimitus</h3><p className="mt-2 leading-7 text-muted">{service.scope}</p>
      <h3 className="mt-5 font-bold">Rajaukset</h3><p className="mt-2 text-sm leading-7 text-muted">{service.exclusions}</p>
      <Link href={service.href} className="mt-6 inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4">{service.href === "/aloita" ? "Pyydä tarjous" : "Tutustu palveluun"}</Link>
    </article>)}</div>
    <p className="mt-8 max-w-3xl leading-7 text-muted">Lisätyöt hinnoitellaan ja hyväksytään kirjallisesti ennen toteutusta. Tiettyä hakusijoitusta, liidimäärää, myyntiä tai liikevaihtoa ei taata.</p>
  </SectionContainer></main><SiteFooter /></>;
}
