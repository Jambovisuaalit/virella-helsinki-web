import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createManualLead, getLeadRecord, updateLeadState } from "@/lib/leads/store";
import { deliveryStatuses, stages, type LeadState } from "@/lib/leads/types";

export const runtime = "nodejs";

function responseUrl(request: Request, result: "updated" | "created" | "error", error = "", view = "leads") {
  const path = view === "sales" ? "/admin/sales" : "/admin/leads";
  const url = new URL(path, new URL(request.url).origin);
  url.searchParams.set("lead_result", result);
  if (error) url.searchParams.set("error", error);
  const response = NextResponse.redirect(url, 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL("/admin", request.url), 303);
  }
  // SameSite=Strict admin cookie + strict same-origin form POST protection.
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return new Response("Forbidden", { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return responseUrl(request, "error", "Virheellinen lomake.");
  }
  const value = (key: string, max = 300) => {
    const raw = form.get(key);
    return typeof raw === "string" ? raw.trim().slice(0, max + 1) : "";
  };
  const view = value("returnTo", 10);
  const action = value("action", 10);

  try {
    if (action === "create") {
      const company = value("company", 160);
      const name = value("name", 120);
      const email = value("email", 200);
      const website = value("website", 300);
      const nextAction = value("nextAction");
      const owner = value("owner", 100);
      if (!company || !name || !/^\S+@\S+\.\S+$/.test(email) || !owner || !nextAction ||
          [company, name, email, website, nextAction, owner].some(item => item.length > 300)) {
        return responseUrl(request, "error", "Täydennä prospektin pakolliset tiedot.", view);
      }
      const result = await createManualLead({
        company, name, email, website, nextAction, owner, isTest: form.get("isTest") === "on",
      });
      return result.ok ? responseUrl(request, "created", "", view)
        : responseUrl(request, "error", result.error, view);
    }

    if (action !== "update") return responseUrl(request, "error", "Tuntematon toiminto.", view);
    const id = value("id", 200);
    const existing = await getLeadRecord(id);
    if (!existing) return responseUrl(request, "error", "Liidiä ei löydy.", view);
    const stage = value("stage", 30);
    const deliveryStatus = value("deliveryStatus", 30);
    const owner = value("owner", 100);
    const nextAction = value("nextAction", 300);
    const nextActionDate = value("nextActionDate", 10);
    const sentEvidence = value("sentEvidence", 300);
    const amount = value("monthlyValue", 30);
    const monthlyValue = Number(amount);
    const next: LeadState = {
      stage: stage as LeadState["stage"],
      deliveryStatus: deliveryStatus as LeadState["deliveryStatus"],
      monthlyValue, owner, nextAction, nextActionDate, sentEvidence,
      isTest: form.get("isTest") === "on",
    };
    if (!stages.includes(next.stage) || !deliveryStatuses.includes(next.deliveryStatus) || !amount ||
        owner.length > 100 || nextAction.length > 300 || sentEvidence.length > 300) {
      return responseUrl(request, "error", "Virheelliset kenttätiedot.", view);
    }
    if (next.deliveryStatus === "sent" &&
        (form.get("confirmSent") !== "on" || !sentEvidence)) {
      return responseUrl(request, "error", "Vahvista lähetys ja lisää Gmailin lähetyslinkki.", view);
    }
    const result = await updateLeadState(id, next);
    return result.ok ? responseUrl(request, "updated", "", view)
      : responseUrl(request, "error", result.error, view);
  } catch {
    console.error("Private lead update failed");
    return responseUrl(request, "error", "Tallennus epäonnistui. Yritä uudelleen.", view);
  }
}
