import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SalesPipeline from "./sales-pipeline";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Sales Pipeline | Virella Helsinki",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  return <SalesPipeline />;
}
