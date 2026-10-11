export const stages = ["Leads", "Conversations", "Qualified", "Offers", "Won"] as const;
export type Stage = (typeof stages)[number];
export const deliveryStatuses = ["received", "in_review", "draft_ready", "sent"] as const;
export type DeliveryStatus = (typeof deliveryStatuses)[number];

export type LeadState = {
  stage: Stage;
  monthlyValue: number;
  isTest: boolean;
  deliveryStatus: DeliveryStatus;
  owner: string;
  nextAction: string;
  nextActionDate: string;
  sentEvidence: string;
};

export type StoredLead = {
  schemaVersion: number;
  receivedAt: string;
  subject: string;
  text: string;
  recipient?: string;
  idempotencyKey?: string;
  status?: string;
  source?: string;
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  requestType?: string;
  initialState?: Partial<LeadState>;
};

export type LeadRecord = {
  id: string; // Canonical private Blob pathname; never exposed to public routes.
  receivedAt: string;
  subject: string;
  name: string;
  company: string;
  email: string;
  website: string;
  requestType: string;
  text: string;
  source: string;
  state: LeadState;
  updatedAt?: string;
};

export type LeadEvent = {
  schemaVersion: 1;
  leadId: string;
  changedAt: string;
  actor: "admin";
  previous: LeadState;
  next: LeadState;
};

const dayFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Helsinki", year: "numeric", month: "2-digit", day: "2-digit",
});

export function addBusinessDays(startIso: string, count = 2): string {
  const date = new Date(startIso);
  if (!Number.isFinite(date.getTime())) throw new Error("Invalid receivedAt");
  const parts = Object.fromEntries(dayFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
  const day = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), 12));
  for (let remaining = count; remaining > 0;) {
    day.setUTCDate(day.getUTCDate() + 1);
    if (day.getUTCDay() !== 0 && day.getUTCDay() !== 6) remaining--;
  }
  return day.toISOString().slice(0, 10);
}

function field(text: string, label: string): string {
  const found = text.split(/\r?\n/).find(line => line.startsWith(label + ": "));
  return found?.slice(label.length + 2).trim() === "—" ? "" : (found?.slice(label.length + 2).trim() || "");
}

export function isExplicitTest(text: string, name = ""): boolean {
  // Only explicit markers count; ordinary messages mentioning QA are real leads by default.
  return /(?:^|\n)QA-TUNNISTE\s*:/i.test(text) || /^Virella integration QA\b/i.test(name);
}

export function hydrateLead(id: string, lead: StoredLead): LeadRecord {
  const receivedAt = lead.receivedAt;
  const requestType = lead.requestType || field(lead.text || "", "Pyyntötyyppi") || "general";
  const name = lead.name || field(lead.text || "", "Nimi");
  const audit = requestType === "visibility_audit";
  const baseline: LeadState = {
    stage: "Leads",
    monthlyValue: 0,
    isTest: isExplicitTest(lead.text || "", name),
    deliveryStatus: "received",
    owner: "Jami",
    nextAction: audit ? "Toimita näkyvyyskartoitus" : "Käsittele yhteydenotto",
    nextActionDate: addBusinessDays(receivedAt, audit ? 2 : 1),
    sentEvidence: "",
  };
  return {
    id, receivedAt, subject: lead.subject || "Aloituspyyntö", name,
    company: lead.company || field(lead.text || "", "Yritys"),
    email: lead.email || field(lead.text || "", "Sähköposti"),
    website: lead.website || field(lead.text || "", "Verkkosivu"),
    requestType, source: lead.source || "Website",
    text: lead.text || "", state: { ...baseline, ...lead.initialState },
  };
}

export function leadMetrics(leads: LeadRecord[]) {
  const live = leads.filter(lead => !lead.state.isTest);
  const stageAtLeast = (stage: Stage) => live.filter(lead =>
    stages.indexOf(lead.state.stage) >= stages.indexOf(stage)).length;
  return {
    leads: live.length,
    conversations: stageAtLeast("Conversations"),
    qualified: stageAtLeast("Qualified"),
    offers: stageAtLeast("Offers"),
    won: stageAtLeast("Won"),
    mrr: live.filter(lead => lead.state.stage === "Won")
      .reduce((total, lead) => total + lead.state.monthlyValue, 0),
    pipeline: live.filter(lead => lead.state.stage !== "Won")
      .reduce((total, lead) => total + lead.state.monthlyValue, 0),
    tests: leads.length - live.length,
  };
}

export function validateUpdate(input: LeadState, previous: LeadState): string | null {
  if (!stages.includes(input.stage)) return "Virheellinen myyntivaihe.";
  if (!deliveryStatuses.includes(input.deliveryStatus)) return "Virheellinen toimitustila.";
  if (!Number.isFinite(input.monthlyValue) || input.monthlyValue < 0 || input.monthlyValue > 1_000_000) return "Virheellinen kuukausiarvo.";
  if (!input.owner.trim() || input.owner.length > 100) return "Vastuuhenkilö puuttuu.";
  if (!input.nextAction.trim() || input.nextAction.length > 300) return "Seuraava toimi puuttuu.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.nextActionDate) ||
      Number.isNaN(new Date(input.nextActionDate + "T12:00:00Z").getTime())) return "Virheellinen määräpäivä.";
  if (input.sentEvidence.length > 300) return "Liian pitkä lähetystodiste.";
  if (previous.deliveryStatus === "sent" && input.deliveryStatus !== "sent") return "Lähetettyä tilaa ei voi perua ilman erillistä uudelleenavausta.";
  if (input.deliveryStatus === "sent" && !/^https:\/\/mail\.google\.com\/mail\//.test(input.sentEvidence)) {
    return "Lähetyksen manuaalinen vahvistus vaatii Gmailin lähetetyn viestin linkin.";
  }
  return null;
}
