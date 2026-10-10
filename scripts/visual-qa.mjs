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
        headerCta: rect(".virella-overlay-trigger"),
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
    assert.ok(checks.logo.right <= checks.headerCta.x - 3, `${spec.width}: header logo and menu trigger overlap`);
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

  // New Virella homepage: concrete hero, visible service prices and SLA copy.
  for (const spec of cases) {
    const page = await browser.newPage({
      viewport: { width: spec.width, height: spec.height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(origin + "/", { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    const home = await page.evaluate(() => {
      const h1 = document.querySelector("#home-title");
      const heroRect = h1.getBoundingClientRect();
      const h1LineHeight = parseFloat(getComputedStyle(h1).lineHeight);
      const priceCards = [...document.querySelectorAll('#palvelut [aria-label$="-palvelun hinta"]')];
      const prices = priceCards.map((el) => el.textContent?.replace(/\s+/g, " ").trim());
      const auditDetails = document.querySelector('[aria-label="Näkyvyyskartoituksen toimitus"]');
      const links = [...document.querySelectorAll('a[href="/aloita?kartoitus=1"]')];
      return {
        documentWidth: document.documentElement.scrollWidth,
        h1Text: h1.textContent?.replace(/\s+/g, " ").trim(),
        heroWidth: Math.round(heroRect.width),
        heroX: Math.round(heroRect.x),
        heroRight: Math.round(heroRect.right),
        heroLines: Math.round(heroRect.height / h1LineHeight * 10) / 10,
        priceCards: prices,
        auditDetails: auditDetails?.textContent?.replace(/\s+/g, " ").trim(),
        auditDetailLines: auditDetails?.querySelectorAll("p").length,
        auditLinks: links.length,
        heroTracking: getComputedStyle(h1).letterSpacing,
        heroImageLoaded: (() => { const img = document.querySelector('img[src="/images/kartoitus-esimerkki.svg"]'); return Boolean(img && img.complete && img.naturalWidth > 0); })(),
        heroImageRight: (() => { const img = document.querySelector('img[src="/images/kartoitus-esimerkki.svg"]'); return img ? Math.round(img.getBoundingClientRect().right) : null; })(),
        previewCaption: document.querySelector("figure figcaption")?.textContent?.trim(),
        contrastRows: (() => {
          function luminance(color) {
            const parts = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
            if (!parts || parts.length !== 3) return null;
            const converted = parts.map(x => { const n = x / 255; return n <= 0.04045 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4); });
            return .2126 * converted[0] + .7152 * converted[1] + .0722 * converted[2];
          }
          function background(element) {
            let current = element;
            while(current) {
              const color = getComputedStyle(current).backgroundColor;
              if (color && color !== "rgba(0, 0, 0, 0)" && color !== "transparent") return color;
              current = current.parentElement;
            }
            return "rgb(9, 11, 12)";
          }
          return [...document.querySelectorAll("#palvelut article p, #palvelut article li, #palvelut article a, figure figcaption")].map(el => {
            const fg = luminance(getComputedStyle(el).color);
            const bg = luminance(background(el));
            const ratio = fg === null || bg === null ? 0 : (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);
            return {text: el.textContent?.trim().slice(0,40), ratio: Math.round(ratio * 100) / 100, fontSize: getComputedStyle(el).fontSize};
          });
        })(),
      };
    });
    console.log("HOME VIEWPORT " + spec.width + ": " + JSON.stringify(home));
    assert.ok(home.documentWidth <= spec.width + 1, "Homepage horizontal overflow at " + spec.width);
    assert.ok(home.heroX >= 0 && home.heroRight <= spec.width + 1, "Homepage H1 overflows at " + spec.width);
    assert.match(home.h1Text, /Verkkosivut, Google-näkyvyys ja some/);
    assert.ok(!home.h1Text.includes("Enemmän yhteydenottoja"), "Outdated result claim in H1");
    assert.ok(home.heroLines <= (spec.width === 320 ? 8 : spec.width === 390 ? 7 : 4), "Homepage H1 wraps excessively at " + spec.width);
    assert.equal(home.priceCards.length, 3, "Missing service pricing at " + spec.width);
    assert.ok(home.priceCards.join(" ").includes("490"), "Missing some price");
    assert.ok(home.priceCards.join(" ").includes("590"), "Missing Google setup price");
    assert.ok(home.priceCards.join(" ").includes("1 500") || home.priceCards.join(" ").includes("1\u00a0500"), "Missing lead setup price");
    assert.equal(home.auditDetailLines, 3, "Audit mechanism must use exactly three lines");
    assert.ok(home.auditDetails.includes("2 arkipäivässä"), "Missing SLA");
    assert.ok(home.auditLinks >= 2, "Audit CTA missing");
    assert.ok(home.heroImageLoaded, "Audit preview image did not load");
    assert.ok(home.heroImageRight <= spec.width + 1, "Audit preview overflows viewport");
    assert.ok(home.previewCaption.includes("ei oikea asiakasraportti"), "Example preview needs explicit label");
    assert.ok(parseFloat(home.heroTracking) >= -1, "Hero letter spacing too tight at " + spec.width);
    for (const row of home.contrastRows) {
      assert.ok(row.ratio >= 4.5, "AA text contrast failed at " + spec.width + ": " + row.text + " ratio=" + row.ratio);
    }
    console.log("HOME CONTRAST " + spec.width + ": " + JSON.stringify(home.contrastRows));

    await page.screenshot({ path: output + "/home-" + spec.width + "-full.png", fullPage: true, animations: "disabled" });
    await page.screenshot({ path: output + "/home-" + spec.width + "-hero.png", animations: "disabled" });
    await page.locator("#palvelut").screenshot({ path: output + "/home-" + spec.width + "-pricing.png", animations: "disabled" });

    if (spec.width === 390) {
      await page.goto(origin + "/aloita?kartoitus=1", { waitUntil: "networkidle" });
      const websiteIsRequired = await page.locator('input[name="website"]').getAttribute("required");
      const notesAreRequired = await page.locator('textarea[name="message"]').getAttribute("required");
      assert.notEqual(websiteIsRequired, null, "Audit website URL must be required");
      assert.equal(notesAreRequired, null, "Audit notes must be optional");
      await page.screenshot({ path: output + "/audit-form-390.png", fullPage: true, animations: "disabled" });
    }
    assert.deepEqual(errors, [], "Homepage browser exceptions: " + errors.join("; "));
    results.push({ homepageWidth: spec.width, heroLines: home.heroLines, scrollWidth: home.documentWidth, prices: home.priceCards });
    await page.close();
  }



  // Framer-inspired full-screen menu: tested on phone, tablet, and desktop.
  const navCases = [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1024, height: 850 },
    { width: 1440, height: 900 },
  ];
  const navRoutes = [
    { path: "/", name: "home", activeLink: "/#palvelut", label: "Palvelut", cta: "Pyydä maksuton näkyvyyskartoitus" },
    { path: "/sosiaalinen-media", name: "social", activeLink: "#hinnoittelu", label: "Hinnoittelu", cta: "Katso palvelut ja hinnat" },
    { path: "/aloita?kartoitus=1", name: "audit", activeLink: "/#palvelut", label: "Palvelut", cta: "Pyydä maksuton näkyvyyskartoitus" },
  ];
  for (const spec of navCases) {
    for (const route of navRoutes) {
      const page = await browser.newPage({ viewport: spec, reducedMotion: "reduce", deviceScaleFactor: 1 });
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      const response = await page.goto(origin + route.path, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200, "Navigation page not found: " + route.path);
      await page.evaluate(() => document.fonts.ready);

      const toggle = page.locator("header .virella-overlay-trigger");
      assert.equal(await toggle.count(), 1, "Overlay menu trigger missing at " + spec.width);
      assert.equal(await toggle.getAttribute("aria-label"), "Avaa valikko");
      assert.ok(await toggle.isVisible(), "Overlay trigger not visible");
      const header = await page.evaluate(() => {
        const logo = document.querySelector("header .brand-logo");
        const trigger = document.querySelector("header .virella-overlay-trigger");
        const rect = el => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: Math.round(r.x), right: Math.round(r.right), top: Math.round(r.top), bottom: Math.round(r.bottom) };
        };
        return { logo: rect(logo), trigger: rect(trigger), scrollWidth: document.documentElement.scrollWidth };
      });
      console.log("MENU HEADER " + spec.width + " " + route.name + ": " + JSON.stringify(header));
      assert.ok(header.scrollWidth <= spec.width + 1, "Horizontal overflow");
      assert.ok(header.logo && header.trigger, "Logo or menu trigger missing");
      assert.ok(header.logo.right < header.trigger.x - 4, "Logo and overlay trigger collide");
      assert.ok(header.trigger.right <= spec.width, "Trigger escapes viewport");

      await toggle.click();
      const dialog = page.getByRole("dialog", { name: "Sivuston navigaatio" });
      assert.ok(await dialog.isVisible(), "Fullscreen overlay didn't open");
      assert.equal(await dialog.getAttribute("aria-modal"), "true");
      const closeButtonLocator = dialog.locator('button[aria-label="Sulje valikko"]');
      assert.equal(await closeButtonLocator.count(), 1, "Dialog close button missing");
      await closeButtonLocator.waitFor({ state: "visible", timeout: 5000 });
      assert.ok(await closeButtonLocator.isVisible(), "Dialog close button not visible after reveal");
      const menuState = await dialog.evaluate(el => {
        const r = el.getBoundingClientRect();
        const nav = el.querySelector("nav");
        const links = [...nav.querySelectorAll("a")];
        return {
          rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom },
          scrollWidth: el.scrollWidth,
          viewportWidth: window.innerWidth,
          scrollLock: document.body.style.overflow,
          navigationLabels: links.map(a => a.textContent.trim()),
          revealVisible: getComputedStyle(el).visibility,
          bg: getComputedStyle(el).backgroundColor,
        };
      });
      console.log("OVERLAY " + spec.width + " " + route.name + ": " + JSON.stringify(menuState));
      assert.equal(menuState.scrollLock, "hidden", "Overlay did not lock background scroll");
      assert.equal(menuState.revealVisible, "visible", "Overlay not visible");
      assert.equal(menuState.rect.left, 0);
      assert.equal(menuState.rect.right, spec.width);
      assert.ok(menuState.scrollWidth <= spec.width + 1, "Overlay horizontal overflow");
      assert.ok(menuState.navigationLabels.some((text) => text.includes(route.label)), "Expected link missing");

      // Visual screenshot is taken with reduced motion to avoid half-open frames.
      await page.screenshot({ path: output + "/menu-" + route.name + "-" + spec.width + "-open.png", animations: "disabled" });

      // Focus stays inside the modal panel, including wrap from the last element.
      const lastCTA = dialog.getByRole("link", { name: route.cta });
      await lastCTA.focus();
      await page.keyboard.press("Tab");
      const focusWrapped = await dialog.locator(".brand-logo").evaluate(el => document.activeElement === el);
      assert.ok(focusWrapped, "Tab did not wrap from CTA to first menu element");

      await page.keyboard.press("Escape");
      assert.equal(await toggle.getAttribute("aria-expanded"), "false", "Escape didn't close menu");
      assert.ok(await toggle.evaluate(el => document.activeElement === el), "Focus wasn't restored to trigger");
      assert.equal(await page.evaluate(() => document.body.style.overflow), "", "Background remained locked");

      await toggle.click();
      const closeButton = dialog.locator('button[aria-label="Sulje valikko"]');
      await closeButton.click();
      assert.equal(await toggle.getAttribute("aria-expanded"), "false", "Close button didn't close overlay");

      await toggle.click();
      await dialog.getByRole("link", { name: route.label, exact: true }).click();
      const expected = route.activeLink.startsWith("/") ? route.activeLink : route.path + route.activeLink;
      await page.waitForURL(url => url.pathname + url.hash === expected, { timeout: 10000 });
      assert.equal(await toggle.getAttribute("aria-expanded"), "false", "Selecting link didn't dismiss menu");
      assert.equal(await page.evaluate(() => document.body.style.overflow), "", "Scroll remained locked after navigation");
      console.log("MENU LINK " + spec.width + " " + route.name + ": " + page.url());
      assert.deepEqual(errors, [], "Browser errors in overlay menu");
      results.push({ overlayWidth: spec.width, page: route.name, bodyScrollLocked: false });
      await page.close();
    }
  }

  writeFileSync(`${output}/summary.json`, JSON.stringify(results, null, 2));
  console.log("VISUAL QA PASSED: both pages at 320, 390, 1440");
} finally {
  await browser.close();
}
