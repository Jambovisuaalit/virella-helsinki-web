import { NextResponse } from "next/server";
import { getQuestionnaireByProductId } from "@/config/questionnaires";
import { products } from "@/config/products";
import { sendAdminNotification } from "@/lib/email/admin-notification";
import { saveOnboardingSubmission, upsertPaidOrder } from "@/lib/supabase/order-store";
import { getCheckoutSession, getProductKeyById, updateCheckoutSessionMetadata } from "@/lib/stripe/stripe-api";

function safeMetadataValue(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().slice(0, 450);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const sessionId = String(formData.get("sessionId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  const questionnaireId = String(formData.get("questionnaireId") ?? "");
  const questionnaire = getQuestionnaireByProductId(productId);
  const productKey = getProductKeyById(productId);

  if (!sessionId || !questionnaire || !productKey || questionnaire.id !== questionnaireId) {
    return NextResponse.json({ error: "invalid_questionnaire_context" }, { status: 400 });
  }

  try {
    const session = await getCheckoutSession(sessionId);
    const metadata = session.metadata ?? {};

    if (
      session.payment_status !== "paid" ||
      metadata.productId !== productId ||
      metadata.productKey !== productKey ||
      metadata.questionnaireId !== questionnaireId
    ) {
      return NextResponse.json({ error: "order_mismatch" }, { status: 409 });
    }

    const answers: Record<string, string> = {};
    for (const field of questionnaire.fields) {
      const value = safeMetadataValue(formData.get(field.name));
      if (field.required && !value) {
        return NextResponse.json({ error: "missing_required_field", field: field.name }, { status: 400 });
      }
      if (value) answers[field.name] = value;
    }

    const completedAt = new Date().toISOString();
    const answerMetadata = Object.fromEntries(
      Object.entries(answers).map(([key, value]) => [`q_${key}`, value]),
    );

    // Webhook is primary, but this upsert makes onboarding resilient if the webhook was delayed.
    await upsertPaidOrder(session);
    await saveOnboardingSubmission({ stripeSessionId: sessionId, questionnaireId, answers });

    // Supabase is the persistent source of truth; Stripe metadata remains a lightweight admin fallback.
    await updateCheckoutSessionMetadata(sessionId, {
      questionnaireStatus: "completed",
      questionnaireCompletedAt: completedAt,
      ...answerMetadata,
    });

    const product = products[productKey];
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const adminUrl = `${origin}/admin?session_id=${encodeURIComponent(sessionId)}`;
    const answerText = questionnaire.fields
      .map((field) => `${field.label}: ${answers[field.name] || "—"}`)
      .join("\n");

    // Notification delivery is secondary. A missing or failing email integration must not turn
    // an already-persisted onboarding submission into a customer-facing 503 response.
    try {
      await sendAdminNotification({
        subject: `Alkukysely vastaanotettu — ${product.name}`,
        idempotencyKey: `questionnaire-${sessionId}`,
        text: [
          "Virella Helsinki — alkukysely vastaanotettu",
          "",
          `Tuote: ${product.name}`,
          `Stripe-session: ${sessionId}`,
          `Valmistui: ${completedAt}`,
          "",
          answerText,
          "",
          `Avaa admin-näkymä: ${adminUrl}`,
        ].join("\n"),
      });
    } catch (notificationError) {
      console.error("Questionnaire admin notification failed", notificationError);
    }

    const redirectUrl = new URL("/alkukysely", origin);
    redirectUrl.searchParams.set("session_id", sessionId);
    redirectUrl.searchParams.set("submitted", "1");
    return NextResponse.redirect(redirectUrl, 303);
  } catch (error) {
    console.error("Questionnaire submission failed", error);
    return NextResponse.json(
      { error: "questionnaire_unavailable", message: "Kyselyä ei voitu tallentaa. Yritä uudelleen." },
      { status: 503 },
    );
  }
}
