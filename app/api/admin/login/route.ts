import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const supplied = String(formData.get("accessToken") ?? "");
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const requestedReturnTo = String(formData.get("returnTo") ?? "/admin");
  const returnTo = requestedReturnTo.startsWith("/admin") ? requestedReturnTo : "/admin";

  if (!expected || supplied !== expected) {
    const invalidUrl = new URL(returnTo, origin);
    invalidUrl.searchParams.set("error", "1");
    return NextResponse.redirect(invalidUrl, 303);
  }

  const response = NextResponse.redirect(new URL(returnTo, origin), 303);
  response.cookies.set("virella_admin", expected, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return response;
}
