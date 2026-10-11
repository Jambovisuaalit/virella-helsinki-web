import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SalesPipeline from "./sales-pipeline";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listLeadRecords } from "@/lib/leads/store";

export const metadata: Metadata = {
  title: "Sales Pipeline | Virella Helsinki",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function SalesPage({ searchParams }: {
  searchParams: Promise<{ lead_result?: string; error?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const params = await searchParams;
  let leads: Awaited<ReturnType<typeof listLeadRecords>>;
  try {
    leads = await listLeadRecords();
  } catch {
    return <main className="mx-auto max-w-5xl p-6"><h1 className="text-3xl font-bold">Sales Pipeline</h1>
      <p role="alert" className="mt-5">Liidien lataaminen epäonnistui. Tarkista yksityinen Blob-varasto.</p>
    </main>;
  }
  return <>
    {params.error && <p role="alert" className="mx-auto max-w-5xl rounded-lg border p-3 text-sm">{params.error}</p>}
    {params.lead_result && params.lead_result !== "error" &&
      <p role="status" className="mx-auto max-w-5xl rounded-lg border p-3 text-sm">
        {params.lead_result === "created" ? "Prospekti tallennettu." : "Liidin tila päivitetty."}
      </p>}
    <SalesPipeline leads={leads} />
  </>;
}
