import { businessConfig } from "@/config/business";

const RESEND_API = "https://api.resend.com/emails";

type AdminNotification = {
  subject: string;
  text: string;
  idempotencyKey: string;
};

export async function sendAdminNotification({ subject, text, idempotencyKey }: AdminNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) throw new Error("Resend is not configured");

  const response = await fetch(RESEND_API, {
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
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Resend API error", response.status, detail);
    throw new Error("Admin notification failed");
  }

  return response.json() as Promise<{ id: string }>;
}
