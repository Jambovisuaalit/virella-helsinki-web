import { NextResponse } from "next/server";
import { products } from "@/config/products";
import { sendAdminNotification } from "@/lib/email/admin-notification";
import { getProductKeyById } from "@/lib/stripe/stripe-api";

function safe(value: FormDataEntryValue | null, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const productId = safe(formData.get("productId"), 120);
  const name = safe(formData.get("name"), 120);
  const email = safe(formData.get("email"), 200);
  const company = safe(formData.get("company"), 160);
  const website = safe(formData.get("website"), 300);
  const message = safe(formData.get("message"), 2000);
  const honeypot = safe(formData.get("companyWebsite"), 200);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const redirectUrl = new URL("/aloita", origin);

  if (productId) redirectUrl.searchParams.set("product", productId);

  // Quietly accept obvious bot submissions without sending email.
  if (honeypot) {
    redirectUrl.searchParams.set("submitted", "1");
    return NextResponse.redirect(redirectUrl, 303);
  }

  if (!name || !validEmail(email) || !message) {
    redirectUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const productKey = productId ? getProductKeyById(productId) : undefined;
  const productName = productKey ? products[productKey].name : "Yhteydenotto";
  const receivedAt = new Date().toISOString();

  try {
    await sendAdminNotification({
      subject: `Uusi aloituspyyntö — ${productName}`,
      idempotencyKey: `contact-${crypto.randomUUID()}`,
      text: [
        "Virella Helsinki — uusi aloituspyyntö",
        "",
        `Palvelu: ${productName}`,
        `Nimi: ${name}`,
        `Sähköposti: ${email}`,
        `Yritys: ${company || "—"}`,
        `Verkkosivu: ${website || "—"}`,
        `Vastaanotettu: ${receivedAt}`,
        "",
        "Viesti:",
        message,
      ].join("\n"),
    });

    redirectUrl.searchParams.set("submitted", "1");
    return NextResponse.redirect(redirectUrl, 303);
  } catch (error) {
    console.error("Contact intake failed", error);
    redirectUrl.searchParams.set("error", "send");
    return NextResponse.redirect(redirectUrl, 303);
  }
}
