import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SalesPipeline from "./sales-pipeline";

export const metadata: Metadata = {
  title: "Sales Pipeline | Virella Helsinki",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const cookieStore = await cookies();
  const expectedToken = process.env.ADMIN_ACCESS_TOKEN;
  const authenticated = Boolean(expectedToken && cookieStore.get("virella_admin")?.value === expectedToken);

  if (!authenticated) redirect("/admin");

  return <SalesPipeline />;
}
