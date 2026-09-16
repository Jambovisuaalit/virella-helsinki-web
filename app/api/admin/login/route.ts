import { NextResponse } from "next/server";
import { createAdminSession, setAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const suppliedUsername = String(formData.get("username") ?? "");
  const suppliedPassword = String(formData.get("password") ?? "");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const requestedReturnTo = String(formData.get("returnTo") ?? "/admin/sales");
  const returnTo = requestedReturnTo.startsWith("/admin") ? requestedReturnTo : "/admin/sales";

  if (!verifyAdminCredentials(suppliedUsername, suppliedPassword)) {
    const invalidUrl = new URL("/admin", origin);
    invalidUrl.searchParams.set("error", "1");
    return NextResponse.redirect(invalidUrl, 303);
  }

  const session = createAdminSession();
  if (!session) {
    const invalidUrl = new URL("/admin", origin);
    invalidUrl.searchParams.set("error", "1");
    return NextResponse.redirect(invalidUrl, 303);
  }

  const response = NextResponse.redirect(new URL(returnTo, origin), 303);
  setAdminSession(response, session);
  return response;
}
