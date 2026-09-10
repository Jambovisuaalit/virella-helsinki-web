import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getQuestionnaireByProductId } from "@/config/questionnaires";
import { products } from "@/config/products";
import {
  getOnboardingSubmissionByOrderId,
  getOrderByStripeSessionId,
  listOrders,
  type StoredOnboardingSubmission,
  type StoredOrder,
} from "@/lib/supabase/order-store";
import { getProductKeyById } from "@/lib/stripe/stripe-api";

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

function statusLabel(status: string) {
  if (status === "completed") return "valmis";
  if (status === "pending") return "odottaa";
  return status;
}

function OrderDetail({ order, onboarding }: { order: StoredOrder; onboarding: StoredOnboardingSubmission | null }) {
  const productKey = getProductKeyById(order.product_id);
  const product = productKey ? products[productKey] : undefined;
  const questionnaire = getQuestionnaireByProductId(order.product_id);
  const answers = onboarding?.answers ?? {};

  return (
    <div className="rounded-[20px] border border-border bg-surface p-5 shadow-[0_8px_40px_-12px_rgba(31,36,46,0.12)] sm:p-8">
      <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Tilaus</p>
          <h2 className="mt-2 text-2xl font-bold">{product?.name ?? order.product_id}</h2>
          <p className="mt-2 break-all text-sm text-muted">{order.stripe_session_id}</p>
        </div>
        <span className="w-fit rounded-lg bg-cloud px-3 py-1.5 text-sm font-bold text-brand">{order.payment_status}</span>
      </div>

      <dl className="grid gap-5 py-6 sm:grid-cols-2">
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Summa</dt><dd className="mt-1 font-bold">{euro(order.amount_total, order.currency)}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Asiakas</dt><dd className="mt-1 font-bold">{order.customer_email ?? "—"}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Alkukysely</dt><dd className="mt-1 font-bold">{statusLabel(order.questionnaire_status)}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Kyselytunniste</dt><dd className="mt-1 text-sm">{order.questionnaire_id ?? "—"}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Maksettu</dt><dd className="mt-1 text-sm">{order.paid_at ? new Date(order.paid_at).toLocaleString("fi-FI") : "—"}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Onboarding vastaanotettu</dt><dd className="mt-1 text-sm">{onboarding ? new Date(onboarding.submitted_at).toLocaleString("fi-FI") : "—"}</dd></div>
      </dl>

      {questionnaire ? (
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-bold">Alkukyselyn vastaukset</h3>
          <dl className="mt-5 space-y-5">
            {questionnaire.fields.map((field) => (
              <div key={field.name}>
                <dt className="text-sm font-bold">{field.label}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted">{answers[field.name] || "—"}</dd>
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

  let selected: StoredOrder | null = null;
  let onboarding: StoredOnboardingSubmission | null = null;
  let orders: StoredOrder[] = [];
  let loadError = false;

  try {
    if (sessionId) {
      selected = await getOrderByStripeSessionId(sessionId);
      if (selected) onboarding = await getOnboardingSubmissionByOrderId(selected.id);
    } else {
      orders = await listOrders();
    }
  } catch (err) {
    console.error("Admin Supabase order load failed", err);
    loadError = true;
  }

  return (
    <>
      <SiteHeader />
      <main>
        <SectionContainer className="py-12 md:py-20">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Admin · Supabase</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em]">Tilaukset ja alkukyselyt</h1>
            </div>
            {sessionId ? <Link href="/admin" className="text-sm font-bold text-brand">← Kaikki tilaukset</Link> : null}
          </div>

          {loadError ? <p className="rounded-xl border border-border bg-surface p-5 text-sm text-muted">Tilaustietoja ei voitu ladata Supabasesta. Tarkista server-side ympäristömuuttujat.</p> : null}
          {sessionId && !selected && !loadError ? <p className="rounded-xl border border-border bg-surface p-5 text-sm text-muted">Tilausta ei löytynyt Supabasesta.</p> : null}
          {selected ? <OrderDetail order={selected} onboarding={onboarding} /> : null}

          {!sessionId && !loadError ? (
            <div className="grid gap-3">
              {orders.length === 0 ? <p className="rounded-xl border border-border bg-surface p-5 text-sm text-muted">Virella-tilauksia ei löytynyt.</p> : null}
              {orders.map((order) => {
                const productKey = getProductKeyById(order.product_id);
                const product = productKey ? products[productKey] : undefined;
                return (
                  <Link key={order.id} href={`/admin?session_id=${encodeURIComponent(order.stripe_session_id)}`} className="grid gap-2 rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <p className="font-bold">{product?.name ?? order.product_id}</p>
                      <p className="mt-1 text-sm text-muted">{order.customer_email ?? "Ei sähköpostia"} · alkukysely {statusLabel(order.questionnaire_status)}</p>
                    </div>
                    <p className="font-bold text-brand">{euro(order.amount_total, order.currency)}</p>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </SectionContainer>
      </main>
      <SiteFooter />
    </>
  );
}
