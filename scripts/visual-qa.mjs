import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const origin = process.env.VISUAL_QA_URL ?? "http://127.0.0.1:3000";
const output = "artifacts/visual-qa";
mkdirSync(output, { recursive: true });

const cases = [
  { width: 320, height: 568, maxHeroLines: 6 },
  { width: 390, height: 844, maxHeroLines: 5 },
  { width: 1440, height: 900, maxHeroLines: 3 },
];

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const results = [];

try {
  for (const spec of cases) {
    const page = await browser.newPage({
      viewport: { width: spec.width, height: spec.height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });

    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(`${origin}/sosiaalinen-media`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);

    await page.evaluate(() => document.fonts.ready);
    const checks = await page.evaluate(() => {
      const rect = (selector) => {
        const el = document.querySelector(selector);
        if (!el) throw new Error(`Missing element ${selector}`);
        const r = el.getBoundingClientRect();
        return {
          x: Math.round(r.x),
          y: Math.round(r.y),
          width: Math.round(r.width),
          height: Math.round(r.height),
          right: Math.round(r.right),
          bottom: Math.round(r.bottom),
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          overflowY: getComputedStyle(el).overflowY,
        };
      };
      const hero = document.querySelector("#hero-title");
      const heroLineHeight = parseFloat(getComputedStyle(hero).lineHeight);
      const cards = [...document.querySelectorAll("#hinnoittelu article")];
      if (cards.length !== 2) throw new Error(`Expected 2 cards, got ${cards.length}`);
      const bounds = cards.map((c) => {
        const r = c.getBoundingClientRect();
        const button = c.querySelector("a[href^='/aloita?product=']");
        const b = button.getBoundingClientRect();
        return {
          title: c.querySelector("h3")?.textContent?.trim(),
          x: Math.round(r.x),
          y: Math.round(r.y),
          right: Math.round(r.right),
          bottom: Math.round(r.bottom),
          height: Math.round(r.height),
          scrollHeight: c.scrollHeight,
          clientHeight: c.clientHeight,
          overflowY: getComputedStyle(c).overflowY,
          buttonX: Math.round(b.x),
          buttonRight: Math.round(b.right),
          buttonBottom: Math.round(b.bottom),
          buttonHeight: Math.round(b.height),
        };
      });
      const sticky = document.querySelector("#hinnoittelu .sticky");
      return {
        innerWidth: innerWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        hero: rect("#hero-title"),
        heroLineHeight,
        heroLines: Math.round(hero.getBoundingClientRect().height / heroLineHeight * 10) / 10,
        logo: rect(".landing-header .brand-logo"),
        headerCta: rect(".landing-header-cta"),
        proof: rect("#todisteet"),
        pricing: rect("#hinnoittelu"),
        cards: bounds,
        stickyDisplay: getComputedStyle(sticky).display,
        stickyPosition: getComputedStyle(sticky).position,
        sticky: rect("#hinnoittelu .sticky"),
      };
    });

    console.log(`VIEWPORT ${spec.width}: ${JSON.stringify(checks)}`);
    assert.ok(checks.documentScrollWidth <= spec.width + 1, `${spec.width}: horizontal overflow ${checks.documentScrollWidth}`);
    assert.ok(checks.hero.right <= spec.width + 1, `${spec.width}: hero width exceeds viewport`);
    assert.ok(checks.heroLines <= spec.maxHeroLines, `${spec.width}: hero wraps excessively (${checks.heroLines} lines)`);
    assert.ok(checks.logo.right <= checks.headerCta.x - 3, `${spec.width}: header logo and CTA overlap`);
    assert.ok(checks.proof.y > checks.hero.bottom, `${spec.width}: proof does not follow hero`);

    for (const card of checks.cards) {
      assert.ok(card.x >= 0 && card.right <= spec.width + 1, `${spec.width}: ${card.title} escapes viewport`);
      assert.ok(card.scrollHeight <= card.clientHeight + 2, `${spec.width}: ${card.title} content clipped`);
      assert.ok(card.buttonX >= 0 && card.buttonRight <= spec.width + 1, `${spec.width}: CTA outside viewport`);
      assert.ok(card.buttonBottom <= card.bottom + 1, `${spec.width}: ${card.title} bottom CTA clipped`);
    }

    if (spec.width < 1024) {
      assert.ok(checks.cards[1].y >= checks.cards[0].bottom - 1, `${spec.width}: mobile cards overlap`);
      assert.equal(checks.stickyPosition, "sticky");
      assert.notEqual(checks.stickyDisplay, "none");
      assert.ok(checks.sticky.height < spec.height * 0.29, `${spec.width}: sticky bar too tall`);
      const pricing = page.locator("#hinnoittelu");
      await pricing.scrollIntoViewIfNeeded();
      await page.evaluate(() => scrollBy(0, 350));
      const stickyY = await page.locator("#hinnoittelu .sticky").evaluate((el) => Math.round(el.getBoundingClientRect().top));
      console.log(`STICKY ${spec.width}: top=${stickyY}`);
      assert.ok(stickyY >= -2 && stickyY <= 120, `${spec.width}: sticky at unexpected y=${stickyY}`);
    } else {
      assert.ok(Math.abs(checks.cards[0].y - checks.cards[1].y) <= 4, "Desktop plans not side by side");
      assert.equal(checks.stickyDisplay, "none");
    }

    await page.locator("button[aria-label='Valitse LinkedIn vertailuun']").click();
    const selected = await page.evaluate(() => ({
      selected: document.querySelector("button[aria-label='Valitse LinkedIn vertailuun']").getAttribute("aria-pressed"),
      mobileLabel: document.querySelector("#hinnoittelu .sticky p")?.textContent?.trim(),
      mobileHref: document.querySelector("#hinnoittelu .sticky a")?.getAttribute("href"),
      visiblePlans: document.querySelectorAll("#hinnoittelu article").length,
    }));
    console.log(`SELECTION ${spec.width}: ${JSON.stringify(selected)}`);
    assert.equal(selected.selected, "true");
    assert.equal(selected.visiblePlans, 2);
    assert.equal(selected.mobileHref, "/aloita?product=linkedin");

    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${output}/social-${spec.width}-full.png`, fullPage: true, animations: "disabled" });
    await page.screenshot({ path: `${output}/social-${spec.width}-hero.png`, fullPage: false, animations: "disabled" });
    await page.locator("#hinnoittelu").screenshot({ path: `${output}/social-${spec.width}-pricing.png`, animations: "disabled" });
    assert.deepEqual(errors, [], `${spec.width}: browser exceptions ${errors.join("; ")}`);

    results.push({ width: spec.width, heroLines: checks.heroLines, documentScrollWidth: checks.documentScrollWidth, cards: checks.cards, errors });
    await page.close();
  }
  writeFileSync(`${output}/summary.json`, JSON.stringify(results, null, 2));
  console.log("VISUAL QA PASSED: 320, 390, 1440");
} finally {
  await browser.close();
}
