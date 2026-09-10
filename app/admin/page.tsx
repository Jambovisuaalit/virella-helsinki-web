import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getQuestionnaireByProductId } from "@/config/questionnaires";
import { products } from "@/config/products";
import { getCheckoutSession, getProductKeyById, listCheckoutSessions, type StripeCheckoutSession } from "@/lib/stripe/stripe-api";

export const metadata: Metadata = {
  title: "Admin | Virella Helsinki",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{ session_id?: string | string[]; error?: string | string[] }>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function euro(amount: number | null, currency: string | null) {
  if (amount === null) return "—";
  return new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: (currency ?? "EUR").toUpperCase(),
  }).format(amount / 100);
}

function OrderDetail({ session }: { session: StripeCheckoutSession }) {
  const metadata = session.metadata ?? {};
  const productKey = metadata.productId ? getProductKeyById(metadata.productId) : undefined;
  const product = productKey ? products[productKey] : undefined;
  const questionnaire = metadata.productId ? getQuestionnaireByProductId(metadata.productId) : undefined;

  return (
    <div className="rounded-[20px] border border-border bg-surface p-5 shadow-[0_8px_40px_-12px_rgba(31,36,46,0.12)] sm:p-8">
      <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Tilaus</p>
          <h2 className="mt-2 text-2xl font-bold">{product?.name ?? metadata.productId ?? "Tuntematon tuote"}</h2>
          <p className="mt-2 break-all text-sm text-muted">{session.id}</p>
        </div>
        <span className="w-fit rounded-lg bg-cloud px-3 py-1.5 text-sm font-bold text-brand">{session.payment_status}</span>
      </div>

      <dl className="grid gap-5 py-6 sm:grid-cols-2">
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Summa</dt><dd className="mt-1 font-bold">{euro(session.amount_total, session.currency)}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Asiakas</dt><dd className="mt-1 font-bold">{session.customer_details?.email ?? "—"}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Alkukysely</dt><dd className="mt-1 font-bold">{metadata.questionnaireStatus ?? "pending"}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Kyselytunniste</dt><dd className="mt-1 text-sm">{metadata.questionnaireId ?? "—"}</dd></div>
      </dl>

      {questionnaire ? (
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-bold">Alkukyselyn vastaukset</h3>
          <dl className="mt-5 space-y-5">
            {questionnaire.fields.map((field) => (
              <div key={field.name}>
                <dt className="text-sm font-bold">{field.label}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted">{metadata[`q_${field.name}`] || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const sessionId = first(params.session_id);
  const error = first(params.error);
  const cookieStore = await cookies();
  const expectedToken = process.env.ADMIN_ACCESS_TOKEN;
  const authenticated = Boolean(expectedToken && cookieStore.get("virella_admin")?.value === expectedToken);
  const returnTo = sessionId ? `/admin?session_id=${encodeURIComponent(sessionId)}` : "/admin";

  if (!authenticated) {
    return (
      <>
        <SiteHeader />
        <main>
          <SectionContainer className="py-16 md:py-24">
            <div className="mx-auto max-w-md rounded-[20px] border border-border bg-surface p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Admin</p>
              <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.035em]">Kirjaudu hallintaan</h1>
              <p className="mt-3 text-sm leading-6 text-muted">Hallintasivu ei ole julkinen. Käytä Verceliin tallennettua admin-tunnistetta.</p>
              {error ? <p className="mt-4 rounded-xl bg-cloud p-3 text-sm font-semibold text-action">Tunniste ei täsmää.</p> : null}
              <form action="/api/admin/login" method="post" className="mt-6 space-y-4">
                <input type="hidden" name="returnTo" value={returnTo} />
                <label htmlFor="accessToken" className="text-sm font-bold">Admin-tunniste</label>
                <input id="accessToken" name="accessToken" type="password" required className="min-h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
                <button className="min-h-12 w-full rounded-xl bg-action px-5 py-3 text-sm font-bold text-white">Avaa hallinta</button>
              </form>
            </div>
          </SectionContainer>
        </main>
        <SiteFooter />
      </>
    );
  }

  let selected: StripeCheckoutSession | null = null;
  let sessions: StripeCheckoutSession[] = [];
  let loadError = false;

  try {
    if (sessionId) selected = await getCheckoutSession(sessionId);
    else sessions = await listCheckoutSessions();
  } catch (err) {
    console.error("Admin order load failed", err);
    loadError = true;
  }

  return (
    <>
      <SiteHeader />
      <main>
        <SectionContainer className="py-12 md:py-20">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Admin</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em]">Tilaukset ja alkukyselyt</h1>
            </div>
            {sessionId ? <Link href="/admin" className="text-sm font-bold text-brand">← Kaikki tilaukset</Link> : null}
          </div>

          {loadError ? <p className="rounded-xl border border-border bg-surface p-5 text-sm text-muted">Tilaustietoja ei voitu ladata. Tarkista Stripe-testitilan ympäristömuuttujat.</p> : null}
          {selected ? <OrderDetail session={selected} /> : null}

          {!sessionId && !loadError ? (
            <div className="grid gap-3">
              {sessions.length === 0 ? <p className="rounded-xl border border-border bg-surface p-5 text-sm text-muted">Virella-tilauksia ei löytynyt.</p> : null}
              {sessions.map((session) => (
                <Link key={session.id} href={`/admin?session_id=${encodeURIComponent(session.id)}`} className="grid gap-2 rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="font-bold">{session.metadata?.productId ?? "Tuntematon tuote"}</p>
                    <p className="mt-1 text-sm text-muted">{session.customer_details?.email ?? "Ei sähköpostia"} · alkukysely {session.metadata?.questionnaireStatus ?? "pending"}</p>
                  </div>
                  <p className="font-bold text-brand">{euro(session.amount_total, session.currency)}</p>
                </Link>
              ))}
            </div>
          ) : null}
        </SectionContainer>
      </main>
      <SiteFooter />
    </>
  );
}
