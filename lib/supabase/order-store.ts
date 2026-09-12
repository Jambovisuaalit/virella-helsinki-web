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

const ORDER_STORE_FUNCTION = "virella-order-store";

function getOrderStoreConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const oidcToken = process.env.VERCEL_OIDC_TOKEN?.trim();
  if (!supabaseUrl || !oidcToken) throw new Error("Supabase order store OIDC configuration is missing");
  return { supabaseUrl, oidcToken };
}

async function orderStoreRequest<T>(payload: Record<string, unknown>) {
  const { supabaseUrl, oidcToken } = getOrderStoreConfig();
  const response = await fetch(`${supabaseUrl}/functions/v1/${ORDER_STORE_FUNCTION}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${oidcToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase order store edge error", response.status, detail);
    throw new Error("Supabase order store request failed");
  }

  return response.json() as Promise<T>;
}

export async function upsertPaidOrder(session: StripeCheckoutSession) {
  const result = await orderStoreRequest<{ order: StoredOrder }>({
    action: "upsert_paid_order",
    session,
  });
  if (!result.order) throw new Error("Supabase order upsert returned no row");
  return result.order;
}

export async function saveOnboardingSubmission(params: {
  stripeSessionId: string;
  questionnaireId: string;
  answers: Record<string, string>;
}) {
  const result = await orderStoreRequest<{ order: StoredOrder }>({
    action: "save_onboarding_submission",
    stripeSessionId: params.stripeSessionId,
    questionnaireId: params.questionnaireId,
    answers: params.answers,
  });
  if (!result.order) throw new Error("Supabase onboarding save returned no order");
  return result.order;
}

export async function getOrderByStripeSessionId(stripeSessionId: string) {
  const result = await orderStoreRequest<{ order: StoredOrder | null }>({
    action: "get_order_by_session",
    stripeSessionId,
  });
  return result.order;
}

export async function listOrders(limit = 50) {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);
  const result = await orderStoreRequest<{ orders: StoredOrder[] }>({
    action: "list_orders",
    limit: safeLimit,
  });
  return result.orders;
}

export async function getOnboardingSubmissionByOrderId(orderId: string) {
  const result = await orderStoreRequest<{ submission: StoredOnboardingSubmission | null }>({
    action: "get_submission_by_order",
    orderId,
  });
  return result.submission;
}
