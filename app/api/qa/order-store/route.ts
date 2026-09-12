import { NextResponse } from "next/server";
import { listOrders } from "@/lib/supabase/order-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.json({ error: "production_only" }, { status: 404 });
  }

  try {
    await listOrders(1);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Order store auth health failed", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
