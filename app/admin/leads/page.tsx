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
    const result = await list({ prefix: "contact-leads/", limit: 100 });
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
    <p className="mt-2 text-sm">Vain kirjautuneelle ylläpidolle. Näytetään korkeintaan 100 viimeisintä haettua tallennetta.</p>
    {error ? <p role="alert" className="mt-6 rounded-lg border p-4">{error}</p> : null}
    {!error && leads.length === 0 ? <p className="mt-6">Ei tallennettuja aloituspyyntöjä.</p> : null}
    <div className="mt-8 space-y-4">{leads.map(({ path, lead }) => <article key={path} className="rounded-xl border p-5">
      <p className="text-sm text-muted">{lead.receivedAt ?? "Aikaleima puuttuu"} · {lead.status ?? "new"}</p>
      <h2 className="mt-2 text-lg font-bold">{lead.subject ?? "Aloituspyyntö"}</h2>
      <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm">{lead.text ?? "Tietoja ei saatavilla"}</pre>
    </article>)}</div>
  </main>;
}
