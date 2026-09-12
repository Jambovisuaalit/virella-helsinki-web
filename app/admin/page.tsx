import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getQuestionnaireByProductId } from "@/config/questionnaires";
import { products } from "@/config/products";
import {
  getDeliveryEventsByOrderId,
  getOnboardingSubmissionByOrderId,
  getOrderByStripeSessionId,
  listOrders,
  type DeliveryStatus,
  type StoredDeliveryEvent,
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
  searchParams: Promise<{
    session_id?: string | string[];
    error?: string | string[];
    delivery?: string | string[];
    delivery_error?: string | string[];
  }>;
};

const DELIVERY_LABELS: Record<DeliveryStatus, string> = {
  awaiting_onboarding: "Odottaa aloituskyselyä",
  ready: "Valmis aloitettavaksi",
  in_progress: "Työn alla",
  client_review: "Asiakkaan tarkistus",
  revision: "Korjauskierros",
  completed: "Toimitettu",
  cancelled: "Peruttu",
};

const NEXT_STATES: Record<DeliveryStatus, DeliveryStatus[]> = {
  awaiting_onboarding: [],
  ready: ["in_progress", "cancelled"],
  in_progress: ["client_review", "completed", "cancelled"],
  client_review: ["revision", "completed", "cancelled"],
  revision: ["client_review", "completed", "cancelled"],
  completed: [],
  cancelled: [],
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

function formatTime(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString("fi-FI") : "—";
}

function questionnaireLabel(status: string) {
  if (status === "completed") return "valmis";
  if (status === "pending") return "odottaa";
  return status;
}

function DeliveryBadge({ status }: { status: DeliveryStatus }) {
  const terminal = status === "completed" || status === "cancelled";
  return (
    <span className={`inline-flex w-fit rounded-lg px-3 py-1.5 text-sm font-bold ${terminal ? "bg-cloud text-muted" : "bg-brand/10 text-brand"}`}>
      {DELIVERY_LABELS[status]}
    </span>
  );
}

function DeliveryPanel({ order, events, returnTo }: { order: StoredOrder; events: StoredDeliveryEvent[]; returnTo: string }) {
  const nextStates = NEXT_STATES[order.delivery_status];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[20px] border border-border bg-surface p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Delivery state</p>
            <h3 className="mt-2 text-xl font-bold">Toimituksen eteneminen</h3>
          </div>
          <DeliveryBadge status={order.delivery_status} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Työ aloitettu</dt><dd className="mt-1 text-sm">{formatTime(order.delivery_started_at)}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Toimitettu</dt><dd className="mt-1 text-sm">{formatTime(order.delivery_completed_at)}</dd></div>
        </dl>

        {nextStates.length > 0 ? (
          <form action="/api/admin/delivery" method="post" className="mt-6 space-y-4 border-t border-border pt-6">
            <input type="hidden" name="orderId" value={order.id} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <div>
              <label htmlFor="nextStatus" className="text-sm font-bold">Seuraava tila</label>
              <select id="nextStatus" name="nextStatus" required className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15">
                {nextStates.map((status) => <option key={status} value={status}>{DELIVERY_LABELS[status]}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="deliveryNote" className="text-sm font-bold">Muistiinpano</label>
              <textarea id="deliveryNote" name="note" rows={3} maxLength={500} placeholder="Esim. audit valmis, odottaa asiakkaan kommentteja" className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
            </div>
            <button className="min-h-12 rounded-xl bg-action px-5 py-3 text-sm font-bold text-white">Päivitä toimitustila</button>
          </form>
        ) : (
          <p className="mt-6 border-t border-border pt-5 text-sm text-muted">Tämä on päätöstila. Uusia siirtymiä ei ole sallittu.</p>
        )}
      </section>

      <section className="rounded-[20px] border border-border bg-surface p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Audit log</p>
        <h3 className="mt-2 text-xl font-bold">Toimitushistoria</h3>
        <div className="mt-6 space-y-4">
          {events.length === 0 ? <p className="text-sm text-muted">Ei vielä toimitussiirtymiä.</p> : null}
          {events.map((event) => (
            <div key={event.id} className="border-l-2 border-brand/25 pl-4">
              <p className="text-sm font-bold">{event.from_status ? DELIVERY_LABELS[event.from_status] : "Alku"} → {DELIVERY_LABELS[event.to_status]}</p>
              <p className="mt-1 text-xs text-muted">{formatTime(event.created_at)} · {event.actor}</p>
              {event.note ? <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">{event.note}</p> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
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
        <div className="flex flex-wrap gap-2">
          <span className="w-fit rounded-lg bg-cloud px-3 py-1.5 text-sm font-bold text-brand">{order.payment_status}</span>
          <DeliveryBadge status={order.delivery_status} />
        </div>
      </div>

      <dl className="grid gap-5 py-6 sm:grid-cols-2 lg:grid-cols-3">
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Summa</dt><dd className="mt-1 font-bold">{euro(order.amount_total, order.currency)}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Asiakas</dt><dd className="mt-1 font-bold">{order.customer_email ?? "—"}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Aloituskysely</dt><dd className="mt-1 font-bold">{questionnaireLabel(order.questionnaire_status)}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Maksettu</dt><dd className="mt-1 text-sm">{formatTime(order.paid_at)}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Onboarding vastaanotettu</dt><dd className="mt-1 text-sm">{onboarding ? formatTime(onboarding.submitted_at) : "—"}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Päivitetty</dt><dd className="mt-1 text-sm">{formatTime(order.updated_at)}</dd></div>
      </dl>

      {questionnaire ? (
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-bold">Aloituskyselyn vastaukset</h3>
          <dl className="mt-5 grid gap-5 md:grid-cols-2">
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
  const delivery = first(params.delivery);
  const deliveryError = first(params.delivery_error);
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
  let events: StoredDeliveryEvent[] = [];
  let orders: StoredOrder[] = [];
  let loadError = false;

  try {
    if (sessionId) {
      selected = await getOrderByStripeSessionId(sessionId);
      if (selected) {
        [onboarding, events] = await Promise.all([
          getOnboardingSubmissionByOrderId(selected.id),
          getDeliveryEventsByOrderId(selected.id),
        ]);
      }
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
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Admin · Delivery command center</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em]">Tilaukset ja toimitukset</h1>
            </div>
            {sessionId ? <Link href="/admin" className="text-sm font-bold text-brand">← Kaikki tilaukset</Link> : null}
          </div>

          {delivery === "updated" ? <p className="mb-5 rounded-xl border border-brand/20 bg-brand/5 p-4 text-sm font-semibold text-brand">Toimitustila päivitetty.</p> : null}
          {deliveryError ? <p className="mb-5 rounded-xl border border-action/20 bg-action/5 p-4 text-sm font-semibold text-action">Toimitustilan päivitys epäonnistui. Nykyinen tila ei ehkä salli valittua siirtymää.</p> : null}
          {loadError ? <p className="rounded-xl border border-border bg-surface p-5 text-sm text-muted">Tilaustietoja ei voitu ladata Supabasesta.</p> : null}
          {sessionId && !selected && !loadError ? <p className="rounded-xl border border-border bg-surface p-5 text-sm text-muted">Tilausta ei löytynyt Supabasesta.</p> : null}

          {selected ? (
            <div className="space-y-5">
              <OrderDetail order={selected} onboarding={onboarding} />
              <DeliveryPanel order={selected} events={events} returnTo={returnTo} />
            </div>
          ) : null}

          {!sessionId && !loadError ? (
            <div className="grid gap-3">
              {orders.length === 0 ? <p className="rounded-xl border border-border bg-surface p-5 text-sm text-muted">Virella-tilauksia ei löytynyt.</p> : null}
              {orders.map((order) => {
                const productKey = getProductKeyById(order.product_id);
                const product = productKey ? products[productKey] : undefined;
                return (
                  <Link key={order.id} href={`/admin?session_id=${encodeURIComponent(order.stripe_session_id)}`} className="grid gap-4 rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 md:grid-cols-[1fr_auto_auto] md:items-center">
                    <div>
                      <p className="font-bold">{product?.name ?? order.product_id}</p>
                      <p className="mt-1 text-sm text-muted">{order.customer_email ?? "Ei sähköpostia"} · aloituskysely {questionnaireLabel(order.questionnaire_status)}</p>
                    </div>
                    <DeliveryBadge status={order.delivery_status} />
                    <p className="font-bold text-brand md:text-right">{euro(order.amount_total, order.currency)}</p>
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
