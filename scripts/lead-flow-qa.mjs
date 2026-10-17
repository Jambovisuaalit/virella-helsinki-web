import assert from "node:assert/strict";
import { chromium } from "playwright";

// Safe browser journey: never submits a valid lead, sends mail or creates payment.
const origin = process.env.VISUAL_QA_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(origin + "/", { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200, "Homepage");
    const cta = page.getByRole("link", { name: "Pyydä maksuton näkyvyyskartoitus" }).first();
    assert.equal(await cta.getAttribute("href"), "/aloita?kartoitus=1");
    await cta.click();
    await page.waitForURL("**/aloita?kartoitus=1");
    assert.equal(await page.locator('form[action="/api/contact"]').count(), 1);
    assert.equal(await page.locator('input[name="requestType"]').inputValue(), "visibility_audit");
    assert.ok(await page.getByRole("button", { name: /Lähetä/ }).count() > 0);
    assert.equal(await page.locator('form[action="/api/checkout"]').count(), 0);
    const layout = await page.evaluate(() => ({ documentWidth: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(layout.documentWidth <= layout.viewport + 1, "Horizontal overflow at " + width);
    assert.deepEqual(errors, [], "Browser errors at " + width);
    await page.getByRole("checkbox", { name: "Yritykselläni ei vielä ole verkkosivuja" }).check();
    assert.equal(await page.locator('input[name="website"]').isDisabled(), true);
    await page.getByRole("checkbox", { name: "Yritykselläni ei vielä ole verkkosivuja" }).uncheck();
    assert.equal(await page.locator('input[name="website"]').isDisabled(), false);
    assert.equal(await page.locator('input[name="website"]').getAttribute("required"), "");
    await page.goto(origin + "/landing-page-seo", { waitUntil: "networkidle" });
    assert.equal(await page.locator("#vertaile article").count(), 3);
    const comparison = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(comparison.width <= comparison.viewport + 1, "Package comparison overflows at " + width);
    await page.close();
  }

  const context = await browser.newContext();
  // Invalid POST must fail before notifications; this is safe against Preview/production.
  const invalid = await context.request.post(origin + "/api/contact", {
    headers: { Accept: "application/json" },
    multipart: { requestType: "visibility_audit", name: "", email: "invalid", website: "invalid" },
  });
  assert.equal(invalid.status(), 400);
  const result = await invalid.json();
  assert.equal(result.ok, false);
  assert.equal(result.error, "invalid");
  await context.close();
  console.log("LEAD FLOW SMOKE PASS: 320 / 390 / 768 / 1440 and invalid intake rejected");
} finally { await browser.close(); }
