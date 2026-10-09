import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));

// Exercise the real handler and product config without sending emails or reading secrets.
function handler({ failStorage = false } = {}) {
  const notifications = [];
  const cache = new Map();
  function load(path) {
    if (cache.has(path)) return cache.get(path).exports;
    const loadedModule = { exports: {} };
    cache.set(path, loadedModule);
    const code = ts.transpileModule(readFileSync(`${root}${path}.ts`, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    vm.runInNewContext(code, {
      module: loadedModule,
      exports: loadedModule.exports,
      require: (name) => {
        if (name === "@/lib/email/admin-notification") return {
          sendAdminNotification: async (notification) => {
            if (failStorage) throw new Error("Simulated storage outage");
            notifications.push(notification);
            return { id: "test-email" };
          },
        };
        return name.startsWith("@/") ? load(name.slice(2)) : require(name);
      },
      process: { env: { NEXT_PUBLIC_SITE_URL: "https://virella.example" } },
      console: { error() {} },
      URL, crypto,
    }, { filename: path });
    return loadedModule.exports;
  }
  return { POST: load("app/api/contact/route").POST, notifications };
}

function request(overrides = {}, json = true) {
  const body = new FormData();
  const values = { productId: "linkedin", name: "Testi", email: "test@example.com", message: "Yrityksen lähtötiedot", ...overrides };
  for (const [key, value] of Object.entries(values)) body.set(key, value);
  return new Request("https://preview.example/api/contact", {
    method: "POST", body, headers: { Accept: json ? "application/json" : "text/html" },
  });
}

test("successful intake preserves the selected service and awaits successful persistence", async () => {
  const { POST, notifications } = handler();
  const response = await POST(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, redirect: "/aloita?product=linkedin&submitted=1" });
  assert.equal(notifications.length, 1);
  assert.match(notifications[0].text, /test@example.com/);
  assert.match(notifications[0].text, /LinkedIn/);
});

test("storage outage reports failure rather than a received request", async () => {
  const { POST } = handler({ failStorage: true });
  const response = await POST(request());
  assert.equal(response.status, 503);
  const result = await response.json();
  assert.equal(result.ok, false);
  assert.equal(result.error, "send");
  assert.equal(result.redirect, "/aloita?product=linkedin&error=send");
});

for (const [label, fields] of Object.entries({
  "blank name": { name: "   " },
  "invalid email": { email: "invalid" },
  "missing message": { message: "" },
  "unknown product": { productId: "unknown" },
  "long name": { name: "x".repeat(121) },
  "long message": { message: "x".repeat(2001) },
  "file instead of text": { company: new Blob(["invalid"]) },
})) {
  test(`rejects ${label} without sending email`, async () => {
    const { POST, notifications } = handler();
    const response = await POST(request(fields));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, "invalid");
    assert.equal(notifications.length, 0);
  });
}

test("malformed body returns validation feedback", async () => {
  const { POST } = handler();
  const response = await POST(new Request("https://preview.example/api/contact", {
    method: "POST", body: "invalid", headers: { Accept: "application/json" },
  }));
  assert.equal(response.status, 400);
});

test("honeypot quietly accepts bots without sending email", async () => {
  const { POST, notifications } = handler();
  assert.equal((await POST(request({ companyWebsite: "spam" }))).status, 200);
  assert.equal(notifications.length, 0);
});

test("native form keeps its 303 redirect and selected service", async () => {
  const { POST } = handler();
  const response = await POST(request({ name: "" }, false));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "https://virella.example/aloita?product=linkedin&error=invalid");
});

test("generic contact requests remain supported", async () => {
  const { POST, notifications } = handler();
  assert.equal((await POST(request({ productId: "" }))).status, 200);
  assert.equal(notifications.length, 1);
  assert.match(notifications[0].subject, /Yhteydenotto/);
});
