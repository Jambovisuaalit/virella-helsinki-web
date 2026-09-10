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

  try {
    const session = await createCheckoutSession(productKey, origin);
    if (!session.url) throw new Error("Stripe checkout URL missing");
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Checkout creation failed", error);
    return NextResponse.json(
      { error: "checkout_unavailable", message: "Maksua ei voitu käynnistää. Yritä uudelleen tai ota yhteyttä." },
      { status: 503 },
    );
  }
}
