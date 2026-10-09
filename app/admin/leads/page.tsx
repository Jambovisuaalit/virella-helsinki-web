import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
export default async function LeadsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  return <main><h1>Aloituspyynnöt</h1></main>;
}
