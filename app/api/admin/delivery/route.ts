import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { transitionDeliveryState, type DeliveryStatus } from "@/lib/supabase/order-store";

const DELIVERY_STATUSES = new Set<DeliveryStatus>([
  "awaiting_onboarding",
  "ready",
  "in_progress",
  "client_review",
  "revision",
  "completed",
  "cancelled",
]);

function safeReturnTo(value: FormDataEntryValue | null) {
  const candidate = String(value ?? "/admin");
  return candidate.startsWith("/admin") ? candidate : "/admin";
}

export async function POST(request: Request) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const formData = await request.formData();
  const returnTo = safeReturnTo(formData.get("returnTo"));
  const expectedToken = process.env.ADMIN_ACCESS_TOKEN;
  const cookieStore = await cookies();
  const authenticated = Boolean(expectedToken && cookieStore.get("virella_admin")?.value === expectedToken);

  if (!authenticated) {
    return NextResponse.redirect(new URL("/admin", origin), 303);
  }

  const orderId = String(formData.get("orderId") ?? "").trim();
  const nextStatus = String(formData.get("nextStatus") ?? "").trim() as DeliveryStatus;
  const note = String(formData.get("note") ?? "").trim().slice(0, 500);

  const resultUrl = new URL(returnTo, origin);

  if (!orderId || !DELIVERY_STATUSES.has(nextStatus)) {
    resultUrl.searchParams.set("delivery_error", "invalid_request");
    return NextResponse.redirect(resultUrl, 303);
  }

  try {
    await transitionDeliveryState({ orderId, nextStatus, note });
    resultUrl.searchParams.set("delivery", "updated");
  } catch (error) {
    console.error("Admin delivery transition failed", error);
    resultUrl.searchParams.set("delivery_error", "transition_failed");
  }

  return NextResponse.redirect(resultUrl, 303);
}
