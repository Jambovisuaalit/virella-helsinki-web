import { products, type ProductId } from "@/config/products";
import { questionnaires } from "@/config/questionnaires";

export type StripeCheckoutSession = {
  id: string;
  object: "checkout.session";
  amount_total: number | null;
  currency: string | null;
  customer_details: {
    email: string | null;
    name: string | null;
  } | null;
  metadata: Record<string, string> | null;
  payment_status: string;
  status: string | null;
  url: string | null;
};

type StripeList<T> = {
  data: T[];
  has_more: boolean;
};

const STRIPE_API = "https://api.stripe.com/v1";

function getSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return key;
}

async function stripeRequest<T>(path: string, init?: { method?: "GET" | "POST"; body?: URLSearchParams }) {
  const response = await fetch(`${STRIPE_API}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      ...(init?.body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: init?.body,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Stripe API error", response.status, detail);
    throw new Error("Stripe request failed");
  }

  return response.json() as Promise<T>;
}

export function getProductKeyById(productId: string): ProductId | undefined {
  return (Object.keys(products) as ProductId[]).find((key) => products[key].id === productId);
}

export function getProductRoute(productKey: ProductId) {
  return productKey === "landingPageSeo" ? "/landing-page-seo" : `/${products[productKey].id}`;
}

export async function createCheckoutSession(productKey: ProductId, origin: string) {
  const product = products[productKey];
  const questionnaire = questionnaires[productKey];
  const amount = product.billing === "month" ? product.totalPrice : product.price;
  const body = new URLSearchParams();

  body.set("mode", "payment");
  body.set("success_url", `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  body.set("cancel_url", `${origin}${getProductRoute(productKey)}?checkout=cancelled`);
  body.set("client_reference_id", product.id);
  body.set("line_items[0][price_data][currency]", "eur");
  body.set("line_items[0][price_data][unit_amount]", String(amount * 100));
  body.set("line_items[0][price_data][product_data][name]", product.name);
  body.set("line_items[0][quantity]", "1");
  body.set("metadata[productKey]", productKey);
  body.set("metadata[productId]", product.id);
  body.set("metadata[questionnaireId]", questionnaire.id);
  body.set("metadata[questionnaireStatus]", "pending");
  body.set("metadata[source]", "virella-helsinki-web");

  return stripeRequest<StripeCheckoutSession>("/checkout/sessions", { method: "POST", body });
}

export function getCheckoutSession(sessionId: string) {
  return stripeRequest<StripeCheckoutSession>(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
}

export async function listCheckoutSessions(limit = 20) {
  const result = await stripeRequest<StripeList<StripeCheckoutSession>>(`/checkout/sessions?limit=${limit}`);
  return result.data.filter((session) => session.metadata?.source === "virella-helsinki-web");
}

export function updateCheckoutSessionMetadata(sessionId: string, metadata: Record<string, string>) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(metadata)) body.set(`metadata[${key}]`, value);
  return stripeRequest<StripeCheckoutSession>(`/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    method: "POST",
    body,
  });
}
