import { businessConfig } from "@/config/business";
import { sendLeadEmail, type EmailNotificationStatus } from "@/lib/email/resend-notification";

type AdminNotification = {
  subject: string;
  text: string;
  idempotencyKey: string;
  replyTo?: string;
};

/**
 * Private Blob persistence is the source of truth. Complete it before any
 * optional email attempt. Do not treat an email provider outage as a failed
 * contact request once private persistence has succeeded.
 */
export async function sendAdminNotification({
  subject,
  text,
  idempotencyKey,
  replyTo,
}: AdminNotification): Promise<{ id: string; notificationStatus: EmailNotificationStatus }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Private lead storage is not configured");
  }

  const { put } = await import("@vercel/blob");
  const createdAt = new Date().toISOString();
  const environment = process.env.VERCEL_ENV === "production" ? "production" : "preview";
  const filename = `contact-leads/${environment}/${createdAt.slice(0, 10)}/${crypto.randomUUID()}.json`;
  const result = await put(filename, JSON.stringify({
    schemaVersion: 1,
    receivedAt: createdAt,
    subject,
    text,
    recipient: businessConfig.adminEmail,
    idempotencyKey,
    status: "new",
  }), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  const notificationStatus = await sendLeadEmail({ subject, text, idempotencyKey, replyTo });
  if (notificationStatus !== "accepted") {
    // Do not log user data, blob paths or secrets.
    console.warn("Contact request persisted; email alert not accepted:", notificationStatus);
  }
  return { id: result.pathname, notificationStatus };
}
