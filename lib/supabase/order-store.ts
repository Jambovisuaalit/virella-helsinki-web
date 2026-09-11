import type { StripeCheckoutSession } from "@/lib/stripe/stripe-api";

export type StoredOrder = {
  id: string;
  stripe_session_id: string;
  product_id: string;
  product_key: string;
  amount_total: number | null;
  currency: string | null;
  payment_status: string;
  customer_email: string | null;
  customer_name: string | null;
  questionnaire_id: string | null;
  questionnaire_status: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StoredOnboardingSubmission = {
  id: string;
  order_id: string;
  questionnaire_id: string;
  answers: Record<string, string>;
  submitted_at: string;
  created_at: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error("Supabase server configuration is missing");
  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

function getAuthHeaders(key: string) {
  return key.startsWith("sb_secret_")
    ? { apikey: key }
    : { apikey: key, Authorization: `Bearer ${key}` };
}

async function supabaseRequest<T>(path: string, init?: RequestInit) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...getAuthHeaders(serviceRoleKey),
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
    "orders?on_conflict=stripe_session_id&select=*",
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
    `orders?stripe_session_id=eq.${encodeURIComponent(params.stripeSessionId)}&select=*&limit=1`,
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

export async function getOrderByStripeSessionId(stripeSessionId: string) {
  const rows = await supabaseRequest<StoredOrder[]>(
    `orders?stripe_session_id=eq.${encodeURIComponent(stripeSessionId)}&select=*&limit=1`,
  );
  return rows[0] ?? null;
}

export async function listOrders(limit = 50) {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);
  return supabaseRequest<StoredOrder[]>(`orders?select=*&order=created_at.desc&limit=${safeLimit}`);
}

export async function getOnboardingSubmissionByOrderId(orderId: string) {
  const rows = await supabaseRequest<StoredOnboardingSubmission[]>(
    `onboarding_submissions?order_id=eq.${encodeURIComponent(orderId)}&select=*&order=submitted_at.desc&limit=1`,
  );
  return rows[0] ?? null;
}
