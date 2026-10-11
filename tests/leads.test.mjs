import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const id = "contact-leads/production/2026-10-11/11111111-1111-4111-8111-111111111111.json";

function harness() {
  const objects = new Map();
  const modules = new Map();
  let authenticated = true;
  const blob = {
    async put(path, value) {
      if (objects.has(path)) throw new Error("Immutable path already exists");
      objects.set(path, JSON.parse(value));
      return { pathname: path };
    },
    async get(path) {
      if (!objects.has(path)) return null;
      return { statusCode: 200, stream: new Response(JSON.stringify(objects.get(path))).body };
    },
    async list({ prefix, limit, cursor }) {
      const matching = [...objects.keys()].filter(p => p.startsWith(prefix)).sort();
      const offset = Number(cursor || "0");
      const paths = matching.slice(offset, offset + limit);
      return { blobs: paths.map(path => ({ pathname: path })),
        hasMore: matching.length > offset + limit, cursor: String(offset + limit) };
    },
  };
  function load(path) {
    if (modules.has(path)) return modules.get(path).exports;
    const mod = { exports: {} };
    modules.set(path, mod);
    const output = ts.transpileModule(readFileSync(root + path + ".ts", "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    vm.runInNewContext(output, {
      module: mod, exports: mod.exports,
      require: name => {
        if (name === "server-only") return {};
        if (name === "@vercel/blob") return blob;
        if (name === "@/lib/admin-auth") return { isAdminAuthenticated: async () => authenticated };
        if (name === "next/server") return { NextResponse: { redirect: (url, status) => new Response(null, { status: status || 307, headers: { location: String(url) } }) } };
        return name.startsWith("@/") ? load(name.slice(2)) : require(name);
      },
      process: { env: { BLOB_READ_WRITE_TOKEN: "test", VERCEL_ENV: "production" } },
      URL, Response, Request, FormData, Blob, Date, Intl, crypto, console,
    }, { filename: path });
    return mod.exports;
  }
  return { objects, load, setAuthenticated: value => { authenticated = value; } };
}

function initialLead(qa = true) {
  return {
    schemaVersion: 1,
    receivedAt: "2026-10-11T06:48:04Z",
    subject: "Uusi aloituspyyntö — Maksuton näkyvyyskartoitus",
    text: "Pyyntötyyppi: visibility_audit\nNimi: QA-TUNNISTE: Testaaja\nSähköposti: example@example.fi\nYritys: Testiyritys",
    ...(qa ? { name: "Virella integration QA 2026" } : { name: "Asiakas" }),
    company: "Testiyritys", email: "example@example.fi", requestType: "visibility_audit",
  };
}

function formUpdate(overrides = {}) {
  const fields = {
    action: "update", returnTo: "leads", id,
    expectedRevision: "2026-10-11T06:48:04Z",
    stage: "Won", monthlyValue: "490",
    deliveryStatus: "draft_ready",
    owner: "Jami", nextAction: "Lähetä kolme korjausehdotusta",
    nextActionDate: "2026-10-13", sentEvidence: "", ...overrides,
  };
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return form;
}
function post(form, origin = "https://virella.example") {
  return new Request("https://virella.example/api/admin/leads", {
    method: "POST", headers: { Origin: origin }, body: form,
  });
}

test("Europe/Helsinki two business days excludes weekends", () => {
  const t = harness().load("lib/leads/types");
  assert.equal(t.addBusinessDays("2026-10-11T06:48:04Z", 2), "2026-10-13");
  assert.equal(t.addBusinessDays("2026-10-09T08:00:00Z", 2), "2026-10-13");
});

test("legacy intake and explicit QA marker hydrate without migration", async () => {
  const h = harness();
  h.objects.set(id, initialLead());
  const lead = await h.load("lib/leads/store").getLeadRecord(id);
  assert.equal(lead.state.isTest, true);
  assert.equal(lead.state.deliveryStatus, "received");
  assert.equal(lead.state.nextActionDate, "2026-10-13");
  assert.equal(lead.email, "example@example.fi");
});

test("shared server records never count QA as pipeline revenue", async () => {
  const h = harness();
  h.objects.set(id, initialLead());
  const store = h.load("lib/leads/store");
  const types = h.load("lib/leads/types");
  const base = await store.getLeadRecord(id);
  const next = { ...base.state, stage: "Won", monthlyValue: 490, isTest: true };
  assert.equal((await store.updateLeadState(id, next, base.updatedAt ?? base.receivedAt)).ok, true);
  const metrics = types.leadMetrics(await store.listLeadRecords());
  assert.equal(metrics.tests, 1);
  assert.equal(metrics.leads, 0);
  assert.equal(metrics.won, 0);
  assert.equal(metrics.mrr, 0);
  assert.equal(h.objects.size, 2); // original lead + append-only audit event, no duplicate lead
});

test("Gmail draft alone cannot mark a lead sent; delivery is read back across requests", async () => {
  const h = harness();
  h.objects.set(id, initialLead());
  const { POST } = h.load("app/api/admin/leads/route");
  const first = await POST(post(formUpdate()));
  assert.equal(first.status, 303);
  const store = h.load("lib/leads/store");
  assert.equal((await store.getLeadRecord(id)).state.deliveryStatus, "draft_ready");
  const revisedAt = (await store.getLeadRecord(id)).updatedAt;
  const rejected = await POST(post(formUpdate({ deliveryStatus: "sent", expectedRevision: revisedAt })));
  assert.match(rejected.headers.get("location"), /lead_result=error/);
  assert.equal((await store.getLeadRecord(id)).state.deliveryStatus, "draft_ready");
  const evidence = "https://mail.google.com/mail/u/0/#all/0123456789abcdef";
  const accepted = formUpdate({ deliveryStatus: "sent", sentEvidence: evidence, confirmSent: "on", expectedRevision: revisedAt });
  assert.equal((await POST(post(accepted))).status, 303);
  const freshlyLoaded = await store.listLeadRecords();
  assert.equal(freshlyLoaded[0].state.deliveryStatus, "sent");
  assert.equal(freshlyLoaded[0].state.sentEvidence, evidence);
  assert.equal(freshlyLoaded.length, 1);
});

test("stale update from another admin session cannot replace fresher lead state", async () => {
  const h = harness();
  h.objects.set(id, initialLead());
  const { POST } = h.load("app/api/admin/leads/route");
  const store = h.load("lib/leads/store");
  const saved = await POST(post(formUpdate({ stage: "Qualified", monthlyValue: "0", nextAction: "Valmistele kartoitus" })));
  assert.equal(saved.status, 303);
  const current = await store.getLeadRecord(id);
  assert.equal(current.state.stage, "Qualified");
  assert.equal(current.state.nextAction, "Valmistele kartoitus");
  const objectCount = h.objects.size;
  // A second browser still holds the original record revision.
  const stale = await POST(post(formUpdate({ stage: "Won", monthlyValue: "490", nextAction: "Vanha päivitys" })));
  assert.match(stale.headers.get("location"), /lead_result=error/);
  assert.match(stale.headers.get("location"), /error=/);
  const after = await store.getLeadRecord(id);
  assert.equal(after.state.stage, "Qualified");
  assert.equal(after.state.nextAction, "Valmistele kartoitus");
  assert.equal(h.objects.size, objectCount);
});

test("unauthenticated and cross-origin admin POSTs cannot update a lead", async () => {
  const h = harness();
  h.objects.set(id, initialLead());
  const { POST } = h.load("app/api/admin/leads/route");
  assert.equal((await POST(post(formUpdate(), "https://attacker.example"))).status, 403);
  h.setAuthenticated(false);
  assert.equal((await POST(post(formUpdate()))).status, 303);
  assert.equal(h.objects.size, 1);
});

test("outbound manual lead deduplicates and defaults to zero revenue", async () => {
  const h = harness();
  const store = h.load("lib/leads/store");
  const input = {
    company: "Testi Oy", name: "Testaaja", email: "test@example.fi", website: "",
    nextAction: "Soita", owner: "Jami", isTest: false,
  };
  assert.equal((await store.createManualLead(input)).ok, true);
  assert.equal((await store.createManualLead(input)).ok, false);
  const leads = await store.listLeadRecords();
  assert.equal(leads.length, 1);
  assert.equal(leads[0].state.monthlyValue, 0);
  assert.equal(leads[0].source, "Outbound");
});

test("admin never silently drops older leads or reports partial sales KPIs", async () => {
  const h = harness();
  for (let n = 0; n < 1001; n++) {
    const day = String(1 + n % 28).padStart(2, "0");
    const uuid = n.toString(16).padStart(12, "0");
    h.objects.set(`contact-leads/production/2026-10-${day}/00000000-0000-4000-8000-${uuid}.json`, initialLead(false));
  }
  await assert.rejects(() => h.load("lib/leads/store").listLeadRecords(), /pagination capacity exceeded/);
});
