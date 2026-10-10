import { NextResponse } from "next/server";
import { products } from "@/config/products";
import { sendAdminNotification } from "@/lib/email/admin-notification";
import { getProductKeyById } from "@/lib/stripe/stripe-api";

function safe(value: FormDataEntryValue | null, maxLength: number) {
  if (value !== null && typeof value !== "string") return undefined;
  const text = (value ?? "").trim();
  return text.length <= maxLength ? text : undefined;
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validAuditWebsite(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname.includes(".") && !url.username && !url.password;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const redirectUrl = new URL("/aloita", origin);
  function respond(error?: "invalid" | "send") {
    redirectUrl.searchParams.set(error ? "error" : "submitted", error ?? "1");
    if (request.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json(
        { ok: !error, error, redirect: `${redirectUrl.pathname}${redirectUrl.search}` },
        { status: error === "invalid" ? 400 : error ? 503 : 200 },
      );
    }
    return NextResponse.redirect(redirectUrl, 303);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return respond("invalid");
  }
  const productId = safe(formData.get("productId"), 120);
  const requestType = safe(formData.get("requestType"), 40);
  const name = safe(formData.get("name"), 120);
  const email = safe(formData.get("email"), 200);
  const company = safe(formData.get("company"), 160);
  const website = safe(formData.get("website"), 300);
  const message = safe(formData.get("message"), 2000);
  const honeypot = safe(formData.get("companyWebsite"), 200);
  const productKey = productId ? getProductKeyById(productId) : undefined;
  if (productKey && productId) redirectUrl.searchParams.set("product", productId);
  const isVisibilityAudit = requestType === "visibility_audit";
  if (isVisibilityAudit) redirectUrl.searchParams.set("kartoitus", "1");

  // Quietly accept obvious bot submissions without persisting a lead.
  if (honeypot) {
    return respond();
  }

  if (!name || !email || !validEmail(email) || (!message && !isVisibilityAudit) ||
      (isVisibilityAudit && (!website || !validAuditWebsite(website))) ||
      company === undefined || website === undefined || productId === undefined ||
      honeypot === undefined || requestType === undefined ||
      (requestType !== "" && !isVisibilityAudit) ||
      (productId && !productKey) || (productId && isVisibilityAudit)) {
    return respond("invalid");
  }

  const productName = isVisibilityAudit
    ? "Maksuton näkyvyyskartoitus"
    : productKey ? products[productKey].name : "Yhteydenotto";

  const receivedAt = new Date().toISOString();

  try {
    await sendAdminNotification({
      subject: `Uusi aloituspyyntö — ${productName}`,
      idempotencyKey: `contact-${crypto.randomUUID()}`,
      text: [
        "Virella Helsinki — uusi aloituspyyntö",
        "",
        `Palvelu: ${productName}`,
        `Pyyntötyyppi: ${isVisibilityAudit ? "visibility_audit" : "general"}`,
        `Nimi: ${name}`,
        `Sähköposti: ${email}`,
        `Yritys: ${company || "—"}`,
        `Verkkosivu: ${website || "—"}`,
        `Vastaanotettu: ${receivedAt}`,
        ...(isVisibilityAudit ? [
          "Toimituslupaus: kolme priorisoitua korjausehdotusta perusteluineen sähköpostiin 2 arkipäivässä.",
          "Tarkista julkinen verkkosivu, paikallinen Google-löydettävyys ja yhteydenottopolku.",
          "TOIMENPIDE: käsittele kartoitus ja vastaa asiakkaan sähköpostiin määräajassa. Toimitus ei ole automaattinen.",
        ] : []),
        "",
        "Viesti:",
        message,
      ].join("\n"),
    });

    return respond();
  } catch {
    // Do not log errors that may contain submitted personal data or storage credentials.
    console.error("Contact intake failed");
    return respond("send");
  }
}
