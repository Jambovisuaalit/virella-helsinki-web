import { NextResponse } from "next/server";
import { requiresWrittenOffer } from "@/config/offer-master";
import { products } from "@/config/products";
import { createCheckoutSession, getProductKeyById } from "@/lib/stripe/stripe-api";

export async function POST(request: Request) {
  const formData = await request.formData();
  const productId = String(formData.get("productId") ?? "");
  const productKey = getProductKeyById(productId);

  if (!productKey) {
    return NextResponse.json({ error: "invalid_product" }, { status: 400 });
  }

  // Keep redirects on the current Preview/production origin, never force users across environments.
  const origin = new URL(request.url).origin;
  // Fail closed: written offer approval comes before any invoice or payment.
  if (requiresWrittenOffer(productId) || products[productKey].billing === "quote") {
    const contactUrl = new URL("/aloita", origin);
    contactUrl.searchParams.set("product", productId);
    return NextResponse.redirect(contactUrl, 303);
  }
  const isProduction = process.env.VERCEL_ENV === "production";
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  const liveWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE?.trim() ?? "";
  const liveCheckoutEnabled =
    process.env.LIVE_CHECKOUT_ENABLED === "true" &&
    stripeKey.startsWith("sk_live_") &&
    liveWebhookSecret.startsWith("whsec_");

  // Public production must never send a real customer into Stripe Test Mode.
  // Live checkout is enabled only after an explicit flag, live Stripe key and live webhook secret are all present.
  if (isProduction && !liveCheckoutEnabled) {
    const contactUrl = new URL("/aloita", origin);
    contactUrl.searchParams.set("product", productId);
    return NextResponse.redirect(contactUrl, 303);
  }

  try {
    const session = await createCheckoutSession(productKey, origin);
    if (!session.url) throw new Error("Stripe checkout URL missing");
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Checkout creation failed", error);
    const contactUrl = new URL("/aloita", origin);
    contactUrl.searchParams.set("product", productId);
    contactUrl.searchParams.set("checkout_error", "1");
    return NextResponse.redirect(contactUrl, 303);
  }
}
