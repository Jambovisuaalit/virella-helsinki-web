import type { StripeCheckoutSession } from "@/lib/stripe/stripe-api";

type StoredOrder = {
  id: string;
  stripe_session_id: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error("Supabase server configuration is missing");
  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

async function supabaseRequest<T>(path: string, init?: RequestInit) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase order store error", response.status, detail);
    throw new Error("Supabase request failed");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function upsertPaidOrder(session: StripeCheckoutSession) {
  const metadata = session.metadata ?? {};
  const rows = await supabaseRequest<StoredOrder[]>(
    "orders?on_conflict=stripe_session_id&select=id,stripe_session_id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        stripe_session_id: session.id,
        product_id: metadata.productId,
        product_key: metadata.productKey,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email ?? null,
        customer_name: session.customer_details?.name ?? null,
        questionnaire_id: metadata.questionnaireId ?? null,
        questionnaire_status: metadata.questionnaireStatus ?? "pending",
        paid_at: session.payment_status === "paid" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  const order = rows[0];
  if (!order) throw new Error("Supabase order upsert returned no row");
  return order;
}

export async function saveOnboardingSubmission(params: {
  stripeSessionId: string;
  questionnaireId: string;
  answers: Record<string, string>;
}) {
  const orders = await supabaseRequest<StoredOrder[]>(
    `orders?stripe_session_id=eq.${encodeURIComponent(params.stripeSessionId)}&select=id,stripe_session_id&limit=1`,
  );
  const order = orders[0];
  if (!order) throw new Error("Supabase order not found for onboarding submission");

  await supabaseRequest(
    "onboarding_submissions?on_conflict=order_id,questionnaire_id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        order_id: order.id,
        questionnaire_id: params.questionnaireId,
        answers: params.answers,
        submitted_at: new Date().toISOString(),
      }),
    },
  );

  await supabaseRequest(`orders?id=eq.${encodeURIComponent(order.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      questionnaire_status: "completed",
      updated_at: new Date().toISOString(),
    }),
  });

  return order;
}
