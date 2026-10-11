import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { list, get } from "@vercel/blob";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Aloituspyynnöt | Virella Helsinki", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Lead = { receivedAt?: string; subject?: string; text?: string; status?: string };

export default async function LeadsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  let leads: Array<{ path: string; lead: Lead }> = [];
  let error = "";
  try {
    const environment = process.env.VERCEL_ENV === "production" ? "production" : "preview";
    const result = await list({ prefix: `contact-leads/${environment}/`, limit: 100 });
    // Pagination is intentionally not enabled yet: show a bounded inbox, not an unbounded fetch.
    const rows = await Promise.all(result.blobs.map(async (blob) => {
      const response = await get(blob.pathname, { access: "private" });
      if (!response || response.statusCode !== 200) return null;
      const lead = await new Response(response.stream).json() as Lead;
      return { path: blob.pathname, lead };
    }));
    leads = rows.filter((row): row is { path: string; lead: Lead } => row !== null)
      .sort((a, b) => (b.lead.receivedAt ?? "").localeCompare(a.lead.receivedAt ?? ""));
  } catch {
    error = "Aloituspyyntöjen hakeminen epäonnistui. Tarkista Blob-varaston yhteys.";
  }

  return <main className="mx-auto max-w-5xl px-5 py-12">
    <nav className="mb-6 flex gap-5 text-sm"><Link href="/admin/sales">Sales Pipeline</Link><Link href="/admin/leads" aria-current="page">Aloituspyynnöt</Link></nav>
    <h1 className="text-3xl font-bold">Aloituspyynnöt</h1>
    <p className="mt-2 text-sm">Vain kirjautuneelle ylläpidolle. Näytetään korkeintaan 100 tallennetta. Tämä näkymä ei vielä sisällä sivutusta.</p>
    {!process.env.RESEND_API_KEY || !process.env.VIRELLA_NOTIFICATION_FROM ? (
      <p role="status" className="mt-5 rounded-xl border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm leading-6 text-foreground">
        Automaattiset sähköposti-ilmoitukset eivät ole käytössä. Kartoituspyynnöt tallentuvat tähän näkymään:
        tarkista uudet pyynnöt vähintään kerran jokaisena arkipäivänä, jotta 2 arkipäivän vastauslupaus toteutuu.
        Virellan oma lähetysverkkotunnus ja sähköpostipalvelun asetukset puuttuvat.
      </p>
    ) : null}
    {error ? <p role="alert" className="mt-6 rounded-lg border p-4">{error}</p> : null}
    {!error && leads.length === 0 ? <p className="mt-6">Ei tallennettuja aloituspyyntöjä.</p> : null}
    <div className="mt-8 space-y-4">{leads.map(({ path, lead }) => <article key={path} className="rounded-xl border p-5">
      <p className="text-sm text-muted">{lead.receivedAt ?? "Aikaleima puuttuu"} · {lead.status ?? "new"}</p>
      <h2 className="mt-2 text-lg font-bold">{lead.subject ?? "Aloituspyyntö"}</h2>
      {lead.subject?.includes("Maksuton näkyvyyskartoitus") ? (
        <p className="mt-2 rounded-lg border border-border bg-surface p-3 text-sm text-foreground">
          Käsittele 2 arkipäivässä vastaanotosta: tarkista verkkosivu, Google-löydettävyys ja yhteydenottopolku.
          Vastaa asiakkaan sähköpostiin kolmella priorisoidulla korjausehdotuksella ja perusteluilla. Tämä vaihe on manuaalinen.
        </p>
      ) : null}
      <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm">{lead.text ?? "Tietoja ei saatavilla"}</pre>
    </article>)}</div>
  </main>;
}
