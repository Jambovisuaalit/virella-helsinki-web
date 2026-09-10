import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { products } from "@/config/products";
import { sendAdminNotification } from "@/lib/email/admin-notification";
import type { StripeCheckoutSession } from "@/lib/stripe/stripe-api";

function verifyStripeSignature(payload: string, signatureHeader: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return false;

  const parts = signatureHeader.split(",");
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0) return false;

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  const expectedBuffer = Buffer.from(expected);

  return signatures.some((signature) => {
    const candidate = Buffer.from(signature);
    return candidate.length === expectedBuffer.length && timingSafeEqual(candidate, expectedBuffer);
  });
}

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !verifyStripeSignature(payload, signature)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const event = JSON.parse(payload) as {
    type: string;
    data: { object: StripeCheckoutSession };
  };

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  const productKey = session.metadata?.productKey as keyof typeof products | undefined;
  const product = productKey ? products[productKey] : undefined;

  if (!product || session.metadata?.productId !== product.id) {
    return NextResponse.json({ error: "invalid_product_metadata" }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const adminUrl = `${origin}/admin?session_id=${encodeURIComponent(session.id)}`;
  const customerEmail = session.customer_details?.email ?? "Ei saatavilla";
  const amount = session.amount_total ? `${(session.amount_total / 100).toFixed(2)} ${session.currency?.toUpperCase() ?? "EUR"}` : "Ei saatavilla";

  await sendAdminNotification({
    subject: `Uusi maksettu tilaus — ${product.name}`,
    idempotencyKey: `order-${session.id}`,
    text: [
      "Virella Helsinki — uusi maksettu tilaus",
      "",
      `Tuote: ${product.name}`,
      `Tuotetunniste: ${product.id}`,
      `Stripe-session: ${session.id}`,
      `Maksun tila: ${session.payment_status}`,
      `Summa: ${amount}`,
      `Asiakas: ${customerEmail}`,
      `Alkukysely: ${session.metadata?.questionnaireStatus ?? "pending"}`,
      "",
      `Avaa admin-näkymä: ${adminUrl}`,
    ].join("\n"),
  });

  return NextResponse.json({ received: true });
}
