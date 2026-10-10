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


  // Header/navigation regression: menu position, keyboard control, route and hash links.
  const navCases = [
    { width: 320, height: 700 },
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1024, height: 850 },
    { width: 1440, height: 900 },
  ];
  const navRoutes = [
    { path: "/", name: "home", activeLink: "/#palvelut", label: "Palvelut" },
    { path: "/sosiaalinen-media", name: "social", activeLink: "#hinnoittelu", label: "Hinnoittelu" },
    { path: "/aloita?kartoitus=1", name: "audit", activeLink: "/#palvelut", label: "Palvelut" },
  ];
  for (const spec of navCases) {
    for (const route of navRoutes) {
      const page = await browser.newPage({
        viewport: spec,
        reducedMotion: "reduce",
        deviceScaleFactor: 1,
      });
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      const response = await page.goto(origin + route.path, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200, "Navigation page not found: " + route.path);
      await page.evaluate(() => document.fonts.ready);

      const info = await page.evaluate(() => {
        const logo = document.querySelector("header .brand-logo");
        const headerCta = document.querySelector("header .landing-header-cta, header a[href='/aloita?kartoitus=1']");
        const nav = document.querySelector("header nav[aria-label='Päänavigaatio']");
        const coords = el => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.x, right: r.right, top: r.top, bottom: r.bottom, width: r.width };
        };
        return {
          scrollWidth: document.documentElement.scrollWidth,
          logo: coords(logo),
          desktopNav: coords(nav),
          desktopDisplay: nav ? getComputedStyle(nav).display : "missing",
          headerCta: coords(headerCta),
          ctaDisplay: headerCta ? getComputedStyle(headerCta).display : "missing",
        };
      });
      console.log("MENU LAYOUT " + spec.width + " " + route.name + ": " + JSON.stringify(info));
      assert.ok(info.scrollWidth <= spec.width + 1, "Horizontal overflow in " + route.name + " " + spec.width);
      assert.ok(info.logo && info.logo.x >= 0 && info.logo.right <= spec.width, "Logo clipped");
      const toggle = page.getByRole("button", { name: "Avaa valikko" });
      if (spec.width < 1024) {
        assert.equal(await toggle.count(), 1, "Mobile menu button missing");
        assert.ok(await toggle.isVisible(), "Mobile menu button hidden");
        assert.equal(info.desktopDisplay, "none", "Desktop menu duplicated on mobile/tablet");

        const toggleRect = await toggle.boundingBox();
        assert.ok(toggleRect.x > info.logo.right + 2, "Logo/menu trigger overlap at " + spec.width);
        assert.ok(toggleRect.x + toggleRect.width <= spec.width, "Menu button clipped at " + spec.width);

        await toggle.click();
        const menu = page.getByRole("navigation", { name: "Mobiilivalikko" });
        assert.ok(await menu.isVisible(), "Mobile menu did not open");
        assert.equal(await page.getByRole("button", { name: "Sulje valikko" }).getAttribute("aria-expanded"), "true");
        const menuRect = await menu.boundingBox();
        assert.ok(menuRect.x >= 0 && menuRect.x + menuRect.width <= spec.width + 1, "Menu panel clips outside viewport");
        assert.ok(menuRect.height > 150, "Menu missing its links");
        assert.ok(await menu.getByRole("link", { name: route.label, exact: true }).isVisible(), "Expected menu link missing");
        await page.screenshot({ path: output + "/menu-" + route.name + "-" + spec.width + "-open.png", animations: "disabled" });

        await page.keyboard.press("Escape");
        assert.equal(await menu.count(), 0, "Escape did not close mobile menu");
        assert.ok(await page.getByRole("button", { name: "Avaa valikko" }).evaluate(el => document.activeElement === el), "Escape did not return focus to trigger");

        await page.getByRole("button", { name: "Avaa valikko" }).click();
        await page.mouse.click(spec.width - 4, spec.height - 5);
        assert.equal(await menu.count(), 0, "Outside click did not dismiss mobile menu");

        await page.getByRole("button", { name: "Avaa valikko" }).click();
        await menu.getByRole("link", { name: route.label, exact: true }).click();
        const expected = route.activeLink.startsWith("/") ? route.activeLink : route.path + route.activeLink;
        await page.waitForURL(url => url.pathname + url.hash === expected, { timeout: 10000 });
        assert.equal(await page.getByRole("navigation", { name: "Mobiilivalikko" }).count(), 0, "Navigation did not close after selecting a link");
        console.log("MENU LINK " + spec.width + " " + route.name + ": " + page.url());
      } else {
        assert.equal(info.desktopDisplay, "flex", "Desktop nav not visible at " + spec.width);
        assert.equal(await toggle.count(), 0, "Mobile menu button shown on desktop");
        assert.ok(info.desktopNav.x >= info.logo.right + 2, "Desktop navigation overlaps logo");
        assert.ok(!info.headerCta || info.desktopNav.right < info.headerCta.x, "Desktop nav overlaps CTA");
        await page.screenshot({ path: output + "/menu-" + route.name + "-" + spec.width + "-desktop.png", animations: "disabled" });
      }
      assert.deepEqual(errors, [], "Browser errors in " + route.name + " at " + spec.width);
      results.push({ navigationWidth: spec.width, page: route.name, scrollWidth: info.scrollWidth, desktopNav: info.desktopDisplay });
      await page.close();
    }
  }

  writeFileSync(`${output}/summary.json`, JSON.stringify(results, null, 2));
  console.log("VISUAL QA PASSED: both pages at 320, 390, 1440");
} finally {
  await browser.close();
}
