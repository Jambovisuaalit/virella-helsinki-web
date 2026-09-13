import { NextResponse } from "next/server";
import { createCheckoutSession, getProductKeyById } from "@/lib/stripe/stripe-api";

export async function POST(request: Request) {
  const formData = await request.formData();
  const productId = String(formData.get("productId") ?? "");
  const productKey = getProductKeyById(productId);

  if (!productKey) {
    return NextResponse.json({ error: "invalid_product" }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
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
