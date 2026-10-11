import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { get, list, put } from "@vercel/blob";
import {
  hydrateLead, validateUpdate,
  type LeadEvent, type LeadRecord, type LeadState, type StoredLead,
} from "@/lib/leads/types";

const MAX_LEADS = 200;
const MAX_EVENTS = 500;

export function leadEnvironment() {
  return process.env.VERCEL_ENV === "production" ? "production" : "preview";
}

function requireStorage() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Private lead storage is not configured");
}

function leadPathValid(path: string): boolean {
  return new RegExp("^contact-leads/" + leadEnvironment() + "/\\d{4}-\\d{2}-\\d{2}/[a-f0-9-]{36}\\.json$").test(path);
}

function eventPrefix(leadId: string) {
  return "contact-lead-events/" + leadEnvironment() + "/" +
    createHash("sha256").update(leadId).digest("hex") + "/";
}

async function privateJson<T>(path: string): Promise<T | null> {
  const blob = await get(path, { access: "private" });
  if (!blob || blob.statusCode !== 200) return null;
  return await new Response(blob.stream).json() as T;
}

async function latestEvent(id: string): Promise<LeadEvent | null> {
  const prefix = eventPrefix(id);
  const events = await list({ prefix, limit: MAX_EVENTS });
  // Fail closed instead of showing stale state after an event-log overflow.
  if (events.hasMore) throw new Error("Lead event history requires pagination");
  const last = [...events.blobs].sort((a, b) => a.pathname.localeCompare(b.pathname)).at(-1);
  if (!last) return null;
  const event = await privateJson<LeadEvent>(last.pathname);
  if (!event || event.leadId !== id) throw new Error("Invalid lead audit event");
  return event;
}

export async function getLeadRecord(id: string): Promise<LeadRecord | null> {
  requireStorage();
  if (!leadPathValid(id)) return null;
  const stored = await privateJson<StoredLead>(id);
  if (!stored) return null;
  const lead = hydrateLead(id, stored);
  const event = await latestEvent(id);
  if (event) {
    lead.state = event.next;
    lead.updatedAt = event.changedAt;
  }
  return lead;
}

export async function listLeadRecords(): Promise<LeadRecord[]> {
  requireStorage();
  const blobs: Array<{ pathname: string }> = [];
  let cursor: string | undefined;
  do {
    const page = await list({
      prefix: "contact-leads/" + leadEnvironment() + "/",
      limit: 100,
      ...(cursor ? { cursor } : {}),
    });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
    if (blobs.length >= MAX_LEADS) break;
  } while (cursor);
  const ids = blobs.map(item => item.pathname).filter(leadPathValid).slice(0, MAX_LEADS);
  const leads = await Promise.all(ids.map(getLeadRecord));
  return leads.filter((lead): lead is LeadRecord => lead !== null)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
}

export async function updateLeadState(
  id: string,
  next: LeadState,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const current = await getLeadRecord(id);
  if (!current) return { ok: false, error: "Liidiä ei löydy." };
  const error = validateUpdate(next, current.state);
  if (error) return { ok: false, error };
  const event: LeadEvent = {
    schemaVersion: 1, leadId: id, actor: "admin",
    previous: current.state, next,
    changedAt: new Date().toISOString(),
  };
  // Append-only state changes form the audit log. Original Blob is never overwritten.
  await put(eventPrefix(id) + event.changedAt + "-" + randomUUID() + ".json", JSON.stringify(event), {
    access: "private", contentType: "application/json", addRandomSuffix: false,
  });
  const persisted = await getLeadRecord(id);
  if (!persisted) throw new Error("Lead update readback missing");
  // Concurrent writes can supersede this event; UI always displays the latest snapshot.
  return { ok: true };
}

export async function createManualLead(input: {
  company: string; name: string; email: string; website: string;
  nextAction: string; owner: string; isTest: boolean;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  requireStorage();
  const existing = await listLeadRecords();
  if (existing.some(lead => lead.company.trim().toLowerCase() === input.company.trim().toLowerCase()
      && lead.email.trim().toLowerCase() === input.email.trim().toLowerCase())) {
    return { ok: false, error: "Sama yritys ja sähköposti ovat jo rekisterissä." };
  }
  const receivedAt = new Date().toISOString();
  const record: StoredLead = {
    schemaVersion: 2, receivedAt,
    subject: "Manuaalinen prospekti", text: "",
    source: "Outbound", name: input.name, company: input.company,
    email: input.email, website: input.website, requestType: "manual",
    initialState: {
      stage: "Leads", monthlyValue: 0, isTest: input.isTest,
      deliveryStatus: "received", owner: input.owner,
      nextAction: input.nextAction,
      nextActionDate: receivedAt.slice(0, 10), sentEvidence: "",
    },
  };
  await put("contact-leads/" + leadEnvironment() + "/" + receivedAt.slice(0, 10) +
    "/" + randomUUID() + ".json", JSON.stringify(record), {
    access: "private", contentType: "application/json", addRandomSuffix: false,
  });
  return { ok: true };
}
