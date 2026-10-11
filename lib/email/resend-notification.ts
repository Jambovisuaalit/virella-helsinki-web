import { businessConfig } from "@/config/business";

export type EmailNotificationStatus = "accepted" | "not_configured" | "failed";

type Notification = {
  subject: string;
  text: string;
  idempotencyKey: string;
  replyTo?: string;
};

/**
 * Send an optional operational alert via Resend.
 *
 * Prerequisites: Virella's own verified sender domain, RESEND_API_KEY, and
 * VIRELLA_NOTIFICATION_FROM configured in Vercel. The Blob lead is the source
 * of truth: a missing/failing email must never cause a saved lead to appear lost.
 *
 * "accepted" means the provider accepted the request, NOT inbox delivery.
 */
export async function sendLeadEmail({
  subject,
  text,
  idempotencyKey,
  replyTo,
}: Notification): Promise<EmailNotificationStatus> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.VIRELLA_NOTIFICATION_FROM?.trim();

  if (!apiKey || !from) return "not_configured";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from,
        to: [businessConfig.adminEmail],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("Contact notification service rejected request", response.status);
      return "failed";
    }
    return "accepted";
  } catch {
    // Do not log submitted personal data, authorization headers or provider errors.
    console.error("Contact notification service unavailable");
    return "failed";
  }
}
