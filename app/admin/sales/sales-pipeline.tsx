"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "virella-sales-pipeline-v1";
const DEFAULT_MRR = 490;

type Stage = "Leads" | "Conversations" | "Qualified" | "Offers" | "Won";

type Lead = {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  value: number;
  stage: Stage;
  source: string;
  note: string;
  createdAt: string;
};

const stages: Stage[] = ["Leads", "Conversations", "Qualified", "Offers", "Won"];

function stageIndex(stage: Stage) {
  return stages.indexOf(stage);
}

function formatEur(value: number) {
  return new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function emptyLead(): Omit<Lead, "id" | "createdAt"> {
  return { company: "", contact: "", email: "", phone: "", value: DEFAULT_MRR, stage: "Leads", source: "Outbound", note: "" };
}

export default function SalesPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState(emptyLead());
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLeads(JSON.parse(raw));
    } catch {
      // Keep the dashboard usable if browser storage is unavailable/corrupt.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads, loaded]);

  const visibleLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((lead) => [lead.company, lead.contact, lead.email, lead.phone, lead.source, lead.note].join(" ").toLowerCase().includes(q));
  }, [leads, query]);

  const won = leads.filter((lead) => lead.stage === "Won");
  const metrics = {
    leads: leads.length,
    conversations: leads.filter((lead) => stageIndex(lead.stage) >= 1).length,
    qualified: leads.filter((lead) => stageIndex(lead.stage) >= 2).length,
    offers: leads.filter((lead) => stageIndex(lead.stage) >= 3).length,
    won: won.length,
    mrr: won.reduce((sum, lead) => sum + lead.value, 0),
    pipeline: leads.filter((lead) => lead.stage !== "Won").reduce((sum, lead) => sum + lead.value, 0),
  };

  function addLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.company.trim() && !draft.contact.trim()) return;
    setLeads((current) => [{ ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...current]);
    setDraft(emptyLead());
    setShowAdd(false);
  }

  function moveLead(id: string, direction: -1 | 1) {
    setLeads((current) => current.map((lead) => {
      if (lead.id !== id) return lead;
      const next = Math.min(stages.length - 1, Math.max(0, stageIndex(lead.stage) + direction));
      return { ...lead, stage: stages[next] };
    }));
  }

  function deleteLead(id: string) {
    setLeads((current) => current.filter((lead) => lead.id !== id));
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-5 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Virella · Sales Command Center</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em]">Lead pipeline</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Leads → Conversations → Qualified → Offers → Won → Active MRR</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Hae yritys, henkilö…" className="min-h-11 rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-brand" />
            <button onClick={() => setShowAdd(true)} className="min-h-11 rounded-xl bg-action px-5 text-sm font-bold text-white">+ Lisää lead</button>
          </div>
        </header>

        <section className="grid gap-3 py-7 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {[
            ["Leads", metrics.leads, "kpl"],
            ["Conversations", metrics.conversations, "kpl"],
            ["Qualified", metrics.qualified, "kpl"],
            ["Offers", metrics.offers, "kpl"],
            ["Won", metrics.won, "kpl"],
            ["Active MRR", formatEur(metrics.mrr), ""],
            ["Open pipeline", formatEur(metrics.pipeline), ""],
          ].map(([label, value, suffix]) => (
            <div key={label} className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
              <p className="mt-3 text-2xl font-extrabold tracking-tight">{value} {suffix}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-5">
          {stages.map((stage) => {
            const items = visibleLeads.filter((lead) => lead.stage === stage);
            return (
              <div key={stage} className="min-h-[360px] rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h2 className="font-bold">{stage}</h2>
                  <span className="rounded-full bg-cloud px-2.5 py-1 text-xs font-bold">{items.length}</span>
                </div>
                <div className="mt-4 space-y-3">
                  {items.map((lead) => (
                    <article key={lead.id} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold">{lead.company || lead.contact}</h3>
                          {lead.contact && lead.company ? <p className="mt-1 truncate text-sm text-muted">{lead.contact}</p> : null}
                        </div>
                        <span className="shrink-0 text-sm font-bold">{formatEur(lead.value)}</span>
                      </div>
                      {lead.email ? <p className="mt-3 truncate text-xs text-muted">{lead.email}</p> : null}
                      {lead.note ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{lead.note}</p> : null}
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                        <span className="text-[11px] font-semibold text-muted">{lead.source}</span>
                        <div className="flex gap-1">
                          {stageIndex(stage) > 0 ? <button onClick={() => moveLead(lead.id, -1)} className="rounded-lg border border-border px-2 py-1 text-xs font-bold" aria-label="Siirrä taakse">←</button> : null}
                          {stageIndex(stage) < stages.length - 1 ? <button onClick={() => moveLead(lead.id, 1)} className="rounded-lg border border-border px-2 py-1 text-xs font-bold" aria-label="Siirrä eteen">→</button> : null}
                          <button onClick={() => deleteLead(lead.id)} className="rounded-lg border border-border px-2 py-1 text-xs font-bold text-muted" aria-label="Poista lead">×</button>
                        </div>
                      </div>
                    </article>
                  ))}
                  {items.length === 0 ? <p className="py-8 text-center text-xs text-muted">Ei leadseja</p> : null}
                </div>
              </div>
            );
          })}
        </section>

        <footer className="mt-7 flex flex-col gap-2 text-xs text-muted sm:flex-row sm:justify-between">
          <span>Active MRR = Won-leadien kuukausiarvo.</span>
          <span>Data tallennetaan tämän admin-selaimen local storageen tässä MVP-versiossa.</span>
        </footer>
      </div>

      {showAdd ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">New lead</p><h2 className="mt-2 text-2xl font-extrabold">Lisää pipelineen</h2></div>
              <button onClick={() => setShowAdd(false)} className="text-xl text-muted" aria-label="Sulje">×</button>
            </div>
            <form onSubmit={addLead} className="mt-6 grid gap-4 sm:grid-cols-2">
              {(["company", "contact", "email", "phone", "source", "value"] as const).map((field) => (
                <label key={field} className={field === "company" || field === "contact" ? "sm:col-span-1" : "sm:col-span-1"}>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{field === "company" ? "Yritys" : field === "contact" ? "Yhteyshenkilö" : field === "email" ? "Sähköposti" : field === "phone" ? "Puhelin" : field === "source" ? "Lähde" : "MRR €"}</span>
                  <input type={field === "value" ? "number" : field === "email" ? "email" : "text"} min={field === "value" ? 0 : undefined} value={draft[field]} onChange={(e) => setDraft({ ...draft, [field]: field === "value" ? Number(e.target.value) : e.target.value })} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand" />
                </label>
              ))}
              <label className="sm:col-span-2"><span className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Muistiinpano</span><textarea value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} rows={3} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-brand" /></label>
              <div className="sm:col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setShowAdd(false)} className="rounded-xl border border-border px-5 py-3 text-sm font-bold">Peruuta</button><button type="submit" className="rounded-xl bg-action px-5 py-3 text-sm font-bold text-white">Tallenna lead</button></div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
