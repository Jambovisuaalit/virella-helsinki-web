import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));

function makeHandler({ configured = true, status = 200, fails = false } = {}) {
  const calls = [];
  const errors = [];
  const env = configured
    ? { RESEND_API_KEY: "test-key-never-real", VIRELLA_NOTIFICATION_FROM: "Virella <notify@verified.example>" }
    : {};
  const exports = {};
  const code = ts.transpileModule(
    readFileSync(`${root}lib/email/resend-notification.ts`, "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  ).outputText;

  vm.runInNewContext(code, {
    exports,
    process: { env },
    require: (id) => {
      if (id === "@/config/business") return { businessConfig: { adminEmail: "inbox@example.com" } };
      return require(id);
    },
    fetch: async (url, options) => {
      calls.push({ url, options });
      if (fails) throw new Error("Never log private request content");
      return { ok: status >= 200 && status < 300, status };
    },
    AbortSignal,
    console: { error: (...args) => errors.push(args) },
  }, { filename: "lib/email/resend-notification.ts" });
  return { send: exports.sendLeadEmail, calls, errors };
}

const message = {
  subject: "Uusi kartoitus",
  text: "Yhteydenotto asiakkaalta",
  idempotencyKey: "test-contact-123",
  replyTo: "customer@example.net",
};

test("Resend is not called without verified sender configuration", async () => {
  const h = makeHandler({ configured: false });
  assert.equal(await h.send(message), "not_configured");
  assert.equal(h.calls.length, 0);
});

test("Resend accepted response uses admin address, reply-to, and idempotency key", async () => {
  const h = makeHandler();
  assert.equal(await h.send(message), "accepted");
  assert.equal(h.calls.length, 1);
  const { url, options } = h.calls[0];
  assert.equal(url, "https://api.resend.com/emails");
  assert.equal(options.method, "POST");
  assert.equal(options.headers["Idempotency-Key"], message.idempotencyKey);
  assert.equal(options.headers.Authorization, "Bearer test-key-never-real");
  const body = JSON.parse(options.body);
  assert.equal(body.from, "Virella <notify@verified.example>");
  assert.deepEqual(Array.from(body.to), ["inbox@example.com"]);
  assert.equal(body.reply_to, "customer@example.net");
  assert.equal(body.subject, message.subject);
  assert.equal(body.text, message.text);
});

test("Resend forbidden response stays a nonfatal email status", async () => {
  const h = makeHandler({ status: 403 });
  assert.equal(await h.send(message), "failed");
  assert.equal(h.errors.length, 1);
  assert.ok(!JSON.stringify(h.errors).includes(message.text));
});

test("Resend network error stays a nonfatal email status without leaking the form", async () => {
  const h = makeHandler({ fails: true });
  assert.equal(await h.send(message), "failed");
  assert.equal(h.errors.length, 1);
  assert.ok(!JSON.stringify(h.errors).includes(message.text));
  assert.ok(!JSON.stringify(h.errors).includes("Never log private"));
});
