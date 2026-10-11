import { deliveryStatuses, stages, type LeadRecord } from "@/lib/leads/types";

const labels = {
  received: "Vastaanotettu",
  in_review: "Kartoituksessa",
  draft_ready: "Vastausluonnos valmis",
  sent: "Lähetetty (manuaalinen vahvistus)",
} as const;

export function LeadUpdateForm({ lead, view }: { lead: LeadRecord; view: "leads" | "sales" }) {
  const state = lead.state;
  return (
    <form action="/api/admin/leads" method="post" className="mt-4 grid gap-3 border-t border-border pt-4 text-sm">
      <input name="action" type="hidden" value="update" />
      <input name="id" type="hidden" value={lead.id} />
      <input name="expectedRevision" type="hidden" value={lead.updatedAt ?? lead.receivedAt} />
      <input name="returnTo" type="hidden" value={view} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label>Myyntivaihe
          <select name="stage" defaultValue={state.stage} className="mt-1 min-h-11 w-full rounded-lg border bg-background px-2">
            {stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
          </select>
        </label>
        <label>Toimituksen tila
          <select name="deliveryStatus" defaultValue={state.deliveryStatus} className="mt-1 min-h-11 w-full rounded-lg border bg-background px-2">
            {deliveryStatuses.map(status => <option key={status} value={status}>{labels[status]}</option>)}
          </select>
        </label>
        <label>Kuukausiarvo (€)
          <input type="number" min="0" max="1000000" step="0.01" name="monthlyValue" defaultValue={state.monthlyValue} required className="mt-1 min-h-11 w-full rounded-lg border bg-background px-3" />
        </label>
        <label>Vastuuhenkilö
          <input name="owner" maxLength={100} defaultValue={state.owner} required className="mt-1 min-h-11 w-full rounded-lg border bg-background px-3" />
        </label>
        <label className="sm:col-span-2">Seuraava tehtävä
          <input name="nextAction" maxLength={300} defaultValue={state.nextAction} required className="mt-1 min-h-11 w-full rounded-lg border bg-background px-3" />
        </label>
        <label>Seuraavan tehtävän määräpäivä
          <input name="nextActionDate" type="date" defaultValue={state.nextActionDate} required className="mt-1 min-h-11 w-full rounded-lg border bg-background px-3" />
        </label>
        <label className="flex items-center gap-2 self-end pb-3">
          <input type="checkbox" name="isTest" defaultChecked={state.isTest} />
          Sisäinen QA-testi — pois KPI-laskennasta
        </label>
        <label className="sm:col-span-2">Lähetetyn sähköpostin Gmail-linkki (vain lähetetty tila)
          <input name="sentEvidence" maxLength={300} defaultValue={state.sentEvidence} placeholder="https://mail.google.com/mail/..." className="mt-1 min-h-11 w-full rounded-lg border bg-background px-3" />
        </label>
        <label className="sm:col-span-2 flex items-center gap-2">
          <input type="checkbox" name="confirmSent" />
          Vahvistan tarkistaneeni, että asiakasvastaus on oikeasti lähetetty Gmailissa.
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">Muutokset tallennetaan yksityiseen tapahtumalokiin. Luonnos ei tarkoita lähetystä.</p>
        <button type="submit" className="min-h-11 rounded-xl bg-action px-5 text-sm font-bold text-white">Tallenna muutokset</button>
      </div>
    </form>
  );
}
