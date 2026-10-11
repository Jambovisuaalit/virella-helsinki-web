import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listLeadRecords } from "@/lib/leads/store";
import { LeadUpdateForm } from "./lead-update-form";

export const metadata: Metadata = { title: "Aloituspyynnöt | Virella Helsinki", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LeadsPage({ searchParams }: {
  searchParams: Promise<{ lead_result?: string; error?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const params = await searchParams;
  let leads: Awaited<ReturnType<typeof listLeadRecords>> = [];
  let error = "";
  try {
    leads = await listLeadRecords();
  } catch {
    error = "Aloituspyyntöjen hakeminen epäonnistui. Tarkista yksityinen Blob-varasto.";
  }

  return <main className="mx-auto max-w-5xl px-5 py-12">
    <nav className="mb-6 flex gap-5 text-sm"><Link href="/admin/sales">Sales Pipeline</Link><Link href="/admin/leads" aria-current="page">Aloituspyynnöt</Link></nav>
    <h1 className="text-3xl font-bold">Aloituspyynnöt ja toimitustila</h1>
    <p className="mt-2 text-sm text-muted">
      Yhteinen palvelinpuolinen rekisteri. Enintään 200 tallennetta tässä MVP-näkymässä; muutokset näkyvät kaikilla kirjautuneilla laitteilla.
    </p>
    {params.error && <p role="alert" className="mt-5 rounded-lg border p-4 text-sm">{params.error}</p>}
    {params.lead_result && params.lead_result !== "error" && <p role="status" className="mt-5 rounded-lg border p-4 text-sm">
      {params.lead_result === "created" ? "Liidi luotu." : "Liidin tila tallennettu."}
    </p>}
    {error && <p role="alert" className="mt-5 rounded-lg border p-4">{error}</p>}
    {!error && leads.length === 0 && <p className="mt-6">Ei tallennettuja aloituspyyntöjä.</p>}
    <div className="mt-8 space-y-5">
      {leads.map(lead => <article key={lead.id} className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted">{lead.receivedAt} · {lead.source} · {lead.requestType}</p>
            <h2 className="mt-2 text-lg font-bold">{lead.company || lead.name || lead.subject}</h2>
            <p className="text-sm">{lead.name} · {lead.email}</p>
            {lead.website && <p className="mt-1 break-words text-sm">{lead.website}</p>}
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">{lead.state.isTest ? "QA-TESTI · ei myyntimittareissa" : lead.state.stage}</p>
            <p>{lead.state.deliveryStatus}</p>
            <p>Seuraava: {lead.state.nextActionDate}</p>
          </div>
        </div>
        {lead.requestType === "visibility_audit" && <p className="mt-3 rounded-lg border border-border bg-background p-3 text-sm">
          Kartoituksen tavoite: verkkosivu, Google-löydettävyys, yhteydenottopolku ja kolme tärkeintä korjausta.
          Vastaus viimeistään kahdessa arkipäivässä. Lähetys merkitään vasta todennetun Gmail-viestin perusteella.
        </p>}
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-semibold">Näytä alkuperäinen pyyntö</summary>
          <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm">{lead.text || "Manuaalinen prospekti"}</pre>
        </details>
        <LeadUpdateForm lead={lead} view="leads" />
      </article>)}
    </div>
  </main>;
