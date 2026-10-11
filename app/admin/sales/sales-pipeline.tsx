import Link from "next/link";
import { LeadUpdateForm } from "@/app/admin/leads/lead-update-form";
import { leadMetrics, stages, type LeadRecord } from "@/lib/leads/types";

const euro = (value: number) => new Intl.NumberFormat("fi-FI", {
  style: "currency", currency: "EUR", maximumFractionDigits: 0,
}).format(value);

export default function SalesPipeline({ leads }: { leads: LeadRecord[] }) {
  const metrics = leadMetrics(leads);
  return <main className="min-h-screen bg-background text-foreground">
    <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <header className="border-b border-border pb-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Virella · Sales Command Center</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em]">Lead pipeline</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Yhteinen palvelinpuolinen myyntiputki. Testitapahtumat eivät vaikuta lukuihin.
        </p>
        <div className="mt-5 flex gap-5 text-sm"><Link href="/admin/leads" className="underline">Saapuneet aloituspyynnöt</Link><Link href="/admin/sales" aria-current="page">Sales Pipeline</Link></div>
      </header>
      <section className="grid gap-3 py-7 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7" aria-label="Myynnin mittarit">
        {[
          ["Leads", metrics.leads, "kpl"], ["Conversations", metrics.conversations, "kpl"],
          ["Qualified", metrics.qualified, "kpl"], ["Offers", metrics.offers, "kpl"],
          ["Won", metrics.won, "kpl"], ["Active MRR", euro(metrics.mrr), ""],
          ["Open pipeline", euro(metrics.pipeline), ""],
        ].map(([title, number, unit]) => <div key={title} className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">{title}</p>
          <p className="mt-3 text-2xl font-extrabold">{number} {unit}</p>
        </div>)}
      </section>
      <p className="mb-5 text-sm text-muted">QA-testejä rekisterissä: {metrics.tests}. Uusien liidien kuukausiarvo on 0 €, kunnes arvo vahvistetaan.</p>
      <section className="rounded-2xl border border-border bg-surface p-5" aria-labelledby="manual-lead-title">
        <h2 id="manual-lead-title" className="text-xl font-bold">Lisää prospekti</h2>
        <p className="mt-1 text-sm text-muted">Palvelinpuolinen tallennus; yritys + sähköposti estää samoja tietoja sisältävän duplikaatin.</p>
        <form action="/api/admin/leads" method="post" className="mt-4 grid gap-3 md:grid-cols-3">
          <input type="hidden" name="action" value="create" />
          <input type="hidden" name="returnTo" value="sales" />
          {[
            ["company", "Yritys", "text"], ["name", "Yhteyshenkilö", "text"],
            ["email", "Sähköposti", "email"], ["website", "Verkkosivu (valinnainen)", "text"],
            ["owner", "Vastuuhenkilö", "text"], ["nextAction", "Seuraava toimi", "text"],
          ].map(([name, label, type]) => <label key={name} className="text-sm">{label}
            <input name={name} type={type} maxLength={300} required={name !== "website"}
              defaultValue={name === "owner" ? "Jami" : undefined}
              className="mt-1 min-h-11 w-full rounded-lg border border-border bg-background px-3" />
          </label>)}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isTest" />Sisäinen QA-testi</label>
          <button className="min-h-11 rounded-xl bg-action px-5 text-sm font-bold text-white">Tallenna prospekti</button>
        </form>
      </section>
      <section className="mt-7 grid gap-4 xl:grid-cols-5" aria-label="Myyntivaiheet">
        {stages.map(stage => {
          const entries = leads.filter(lead => lead.state.stage === stage);
          return <div key={stage} className="min-w-0 rounded-2xl border border-border bg-surface p-4">
            <h2 className="font-bold">{stage} ({entries.filter(lead => !lead.state.isTest).length})</h2>
            <div className="mt-4 space-y-4">
              {entries.map(lead => <details key={lead.id} className="rounded-xl border border-border bg-background p-3">
                <summary className="cursor-pointer text-sm font-semibold">
                  <span className="break-words">{lead.company || lead.name}</span>
                  {lead.state.isTest && <span className="ml-2 text-xs text-muted">(QA)</span>}
                </summary>
                <p className="mt-2 break-words text-xs text-muted">{lead.name} · {lead.email}</p>
                <p className="mt-1 text-xs">Toimitus: {lead.state.deliveryStatus} · Next: {lead.state.nextActionDate}</p>
                <LeadUpdateForm lead={lead} view="sales" />
              </details>)}
              {!entries.length && <p className="text-sm text-muted">Ei liidejä</p>}
            </div>
          </div>;
        })}
      </section>
      <p className="mt-7 text-sm text-muted">Myyntimittarit eivät sisällä QA-testejä. Tilamuutokset kirjautuvat yksityiseen tapahtumalokiin.</p>
    </div>
  </main>;
