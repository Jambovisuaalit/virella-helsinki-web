import { businessConfig } from "@/config/business";

type AdminNotification = {
  subject: string;
  text: string;
  idempotencyKey: string;
};

/**
 * Persist contact requests as private Vercel Blob objects.
 * Never put personal data in blob paths or application logs.
 */
export async function sendAdminNotification({ subject, text, idempotencyKey }: AdminNotification) {
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

  return { id: result.pathname };
}
