import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin | Virella Helsinki",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdminAuthenticated()) redirect("/admin/sales");

  const { error } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main>
        <SectionContainer className="py-16 md:py-24">
          <div className="mx-auto max-w-md rounded-[20px] border border-border bg-surface p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Admin</p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.035em]">Kirjaudu hallintaan</h1>
            <p className="mt-3 text-sm leading-6 text-muted">Virellan sisäinen hallinta. Kirjautuminen avaa Sales Pipeline -näkymän.</p>
            {error ? <p className="mt-4 rounded-xl bg-cloud p-3 text-sm font-semibold text-action">Virheellinen käyttäjätunnus tai salasana.</p> : null}
            <form action="/api/admin/login" method="post" className="mt-6 space-y-4">
              <input type="hidden" name="returnTo" value="/admin/sales" />
              <div>
                <label htmlFor="username" className="text-sm font-bold">Käyttäjätunnus</label>
                <input id="username" name="username" type="text" autoComplete="username" required className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-bold">Salasana</label>
                <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
              </div>
              <button className="min-h-12 w-full rounded-xl bg-action px-5 py-3 text-sm font-bold text-white">Kirjaudu</button>
            </form>
          </div>
        </SectionContainer>
      </main>
      <SiteFooter />
    </>
  );
}
