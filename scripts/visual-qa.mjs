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
        serviceIconCounts: cards.map((card) => card.querySelectorAll("svg[aria-hidden='true']").length),
        stickyDisplay: getComputedStyle(sticky).display,
        stickyPosition: getComputedStyle(sticky).position,
        sticky: rect("#hinnoittelu .sticky"),
      };
    });

    console.log(`VIEWPORT ${spec.width}: ${JSON.stringify(checks)}`);
    const socialTokens = await page.evaluate(() => {
      const sections = ["#todisteet", "#prosessi", "#hinnoittelu", "#yhteys"];
      const titles = ["#proof-title", "#process-title", "#pricing-title", "#contact-title"];
      return {
        verticalSpacing: sections.map(sel => parseFloat(getComputedStyle(document.querySelector(sel)).paddingTop)),
        titleFontSizes: titles.map(sel => parseFloat(getComputedStyle(document.querySelector(sel)).fontSize)),
        titleLetterSpacing: titles.map(sel => getComputedStyle(document.querySelector(sel)).letterSpacing),
      };
    });
    console.log("SOCIAL TOKENS " + spec.width + ": " + JSON.stringify(socialTokens));
    assert.ok(socialTokens.verticalSpacing.every(x => x >= 85), "Some service sections too cramped");
    assert.ok(socialTokens.verticalSpacing.every(x => Math.abs(x - socialTokens.verticalSpacing[0]) <= 1), "Some sections inconsistent vertical rhythm");
    assert.ok(socialTokens.titleFontSizes.every(x => Math.abs(x - socialTokens.titleFontSizes[0]) <= 1), "Some headings use inconsistent type sizes");

    assert.ok(checks.documentScrollWidth <= spec.width + 1, `${spec.width}: horizontal overflow ${checks.documentScrollWidth}`);
    assert.ok(checks.hero.right <= spec.width + 1, `${spec.width}: hero width exceeds viewport`);
    assert.ok(checks.heroLines <= spec.maxHeroLines, `${spec.width}: hero wraps excessively (${checks.heroLines} lines)`);
    assert.ok(checks.logo.right <= checks.headerCta.x - 3, `${spec.width}: header logo and menu trigger overlap`);
    assert.ok(checks.serviceIconCounts[0] >= 2, `${spec.width}: Instagram and Facebook plan icons missing`);
    assert.ok(checks.serviceIconCounts[1] >= 1, `${spec.width}: LinkedIn plan icon missing`);
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
        previewCard: (() => {
          const card = document.querySelector(".virella-audit-preview");
          if (!card) return null;
          const rows = [...card.querySelectorAll("ol > li")];
          const headings = rows.map(row => row.querySelector("h4"));
          const rect = card.getBoundingClientRect();
          return {
            count: rows.length,
            width: Math.round(rect.width),
            right: Math.round(rect.right),
            itemsVisible: rows.every(row => row.getBoundingClientRect().height >= 60),
            titles: headings.map(title => title?.textContent?.trim()),
            minHeadingFont: Math.min(...headings.map(title => parseFloat(getComputedStyle(title).fontSize))),
            caption: document.querySelector("#esimerkkikartoitus figcaption")?.textContent?.trim(),
          };
        })(),
        backdrop: (() => {
          const section = document.querySelector(".virella-photographic-hero");
          const img = section?.querySelector('img[src="/images/virella-workspace-hero.webp"]');
          const veil = section?.querySelector(".virella-hero-veil");
          if (!section || !img || !veil) return null;
          const s = section.getBoundingClientRect();
          const v = veil.getBoundingClientRect();
          return {
            loaded: img.complete && img.naturalWidth >= 1000,
            decorative: img.getAttribute("alt") === "",
            naturalWidth: img.naturalWidth,
            gradient: getComputedStyle(veil).backgroundImage,
            filter: getComputedStyle(img).filter,
            veilCovers: Math.abs(s.left - v.left) < 2 && Math.abs(s.right - v.right) < 2 &&
              Math.abs(s.top - v.top) < 2 && Math.abs(s.bottom - v.bottom) < 2,
          };
        })(),
        heroWord: (() => {
          const el = document.querySelector("#home-title span.whitespace-nowrap");
          if (!el) return null;
          const bounds = el.getBoundingClientRect();
          return { right: Math.round(bounds.right), width: Math.round(bounds.width), whiteSpace: getComputedStyle(el).whiteSpace };
        })(),
        heroCTA: (() => {
          const a = document.querySelector('.virella-photographic-hero a[href="/aloita?kartoitus=1"]');
          if (!a) return null;
          const range = document.createRange();
          range.selectNodeContents(a);
          return { label: a.textContent.trim(), lineBoxes: range.getClientRects().length, width: Math.round(a.getBoundingClientRect().width) };
        })(),
        headingSamples: (() => {
          const selectors = ["#preview-title", "#services-title", "#process-title", "#contact-title"];
          return selectors.map(selector => {
            const el = document.querySelector(selector);
            const s = getComputedStyle(el);
            return { selector, fontSize: s.fontSize, letterSpacing: s.letterSpacing, lineHeight: s.lineHeight };
          });
        })(),
        previewCaption: document.querySelector("figure figcaption")?.textContent?.trim(),
        spaciousLayout: (() => {
          const hero = document.querySelector(".virella-photographic-hero");
          const preview = document.querySelector("#esimerkkikartoitus");
          const services = document.querySelector("#palvelut");
          const firstCard = services?.querySelector("article");
          if (!hero || !preview || !services || !firstCard) return null;
          const hr = hero.getBoundingClientRect(), pr = preview.getBoundingClientRect(), sr = services.getBoundingClientRect();
          return {
            heroBottom: Math.round(hr.bottom),
            previewTop: Math.round(pr.top),
            previewBottom: Math.round(pr.bottom),
            servicesTop: Math.round(sr.top),
            previewPaddingTop: parseFloat(getComputedStyle(preview).paddingTop),
            servicesPaddingTop: parseFloat(getComputedStyle(services).paddingTop),
            cardPaddingX: parseFloat(getComputedStyle(firstCard).paddingLeft),
            cardPaddingY: parseFloat(getComputedStyle(firstCard).paddingTop),
          };
        })(),
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
    assert.ok(home.previewCard, "Audit preview card is missing");
    assert.equal(home.previewCard.count, 3, "Preview must show exactly three example corrections");
    assert.ok(home.previewCard.itemsVisible, "Example rows have collapsed");
    assert.ok(home.previewCard.minHeadingFont >= 16, "Example titles are too small on mobile");
    assert.ok(home.previewCard.right <= spec.width + 1, "Audit preview clips horizontally");
    assert.ok(home.previewCard.caption?.includes("ei oikea asiakasraportti"), "Example must remain clearly labeled");
    assert.ok(home.backdrop?.loaded, "Hero photo did not load at " + spec.width);
    assert.ok(home.backdrop?.decorative, "Hero photo should be decorative; content stays readable as HTML");
    assert.ok(home.backdrop?.veilCovers, "Hero overlay does not cover whole photo section");
    assert.ok(home.backdrop.gradient.includes("gradient"), "Responsive dark overlay not applied");
    assert.ok(home.backdrop.filter.includes("brightness"), "Hero picture lacks contrast-controlled darkening");
    console.log("HOME BACKDROP " + spec.width + ": " + JSON.stringify(home.backdrop));
    assert.ok(home.heroWord, "Unbreakable Google keyword span missing");
    assert.equal(home.heroWord.whiteSpace, "nowrap", "Google-näkyvyys should not split");
    assert.ok(home.heroWord.right <= spec.width + 1, "Hero keyword clips viewport");
    assert.ok(home.heroCTA?.label === "Pyydä maksuton kartoitus", "Hero CTA label was not shortened");
    assert.equal(home.heroCTA?.lineBoxes, 1, "Hero CTA wraps at " + spec.width);
    if (spec.width < 1024) {
      const match = home.backdrop.filter.match(/brightness\(([^)]+)\)/);
      assert.ok(match && parseFloat(match[1]) >= .84, "Mobile photo should be more visible");
    }
    assert.ok(home.headingSamples.every(item => item.fontSize === home.headingSamples[0].fontSize), "Home section titles use inconsistent type sizes");
    assert.ok(home.previewCaption.includes("ei oikea asiakasraportti"), "Example preview needs explicit label");
    assert.ok(home.spaciousLayout, "Homepage sections missing");
    assert.ok(Math.abs(home.spaciousLayout.heroBottom - home.spaciousLayout.previewTop) <= 1, "Sample preview is not directly after hero");
    assert.ok(Math.abs(home.spaciousLayout.previewBottom - home.spaciousLayout.servicesTop) <= 1, "Preview-to-services rhythm broken");
    assert.ok(home.spaciousLayout.previewPaddingTop >= 85, "Sample needs generous vertical spacing");
    assert.ok(home.spaciousLayout.servicesPaddingTop >= 85, "Service section needs generous spacing");
    assert.ok(home.spaciousLayout.cardPaddingX >= 27, "Service card horizontal padding too narrow");
    assert.ok(home.spaciousLayout.cardPaddingY >= 35, "Service card vertical padding too tight");
    console.log("HOME RHYTHM " + spec.width + ": " + JSON.stringify(home.spaciousLayout));
    assert.ok(parseFloat(home.heroTracking) >= -1, "Hero letter spacing too tight at " + spec.width);
    for (const row of home.contrastRows) {
      assert.ok(row.ratio >= 4.5, "AA text contrast failed at " + spec.width + ": " + row.text + " ratio=" + row.ratio);
    }
    console.log("HOME CONTRAST " + spec.width + ": " + JSON.stringify(home.contrastRows));

    await page.screenshot({ path: output + "/home-" + spec.width + "-full.png", fullPage: true, animations: "disabled" });
    await page.screenshot({ path: output + "/home-" + spec.width + "-hero.png", animations: "disabled" });
    await page.locator("#esimerkkikartoitus").screenshot({ path: output + "/home-" + spec.width + "-report.png", animations: "disabled" });
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
        return {
          logo: rect(logo),
          trigger: rect(trigger),
          scrollWidth: document.documentElement.scrollWidth,
          logoCenteredOffset: logo ? Math.round((logo.getBoundingClientRect().left + logo.getBoundingClientRect().right) / 2 - innerWidth / 2) : null,
          logoVerticalOffset: logo && trigger ? Math.round((logo.getBoundingClientRect().top + logo.getBoundingClientRect().bottom - trigger.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom) / 2) : null,
        };
      });
      console.log("MENU HEADER " + spec.width + " " + route.name + ": " + JSON.stringify(header));
      assert.ok(header.scrollWidth <= spec.width + 1, "Horizontal overflow");
      assert.ok(header.logo && header.trigger, "Logo or menu trigger missing");
      assert.ok(header.logo.right < header.trigger.x - 4, "Logo and overlay trigger collide");
      assert.ok(Math.abs(header.logoCenteredOffset) <= 2, "Header wordmark not centered at " + spec.width + ": " + header.logoCenteredOffset);
      assert.ok(Math.abs(header.logoVerticalOffset) <= 2, "Header wordmark and trigger vertical centers differ at " + spec.width);
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
      const overlayLogoOffset = await dialog.locator(".virella-overlay-heading .brand-logo").evaluate(el => {
        const r = el.getBoundingClientRect();
        return Math.round((r.left + r.right) / 2 - innerWidth / 2);
      });
      console.log("OVERLAY LOGO " + spec.width + " " + route.name + ": center offset=" + overlayLogoOffset);
      assert.ok(Math.abs(overlayLogoOffset) <= 2, "Open menu wordmark not centered: " + overlayLogoOffset);
      assert.ok(menuState.scrollWidth <= spec.width + 1, "Overlay horizontal overflow");
      assert.ok(menuState.navigationLabels.some((text) => text.includes(route.label)), "Expected link missing");

      // Visual screenshot is taken with reduced motion to avoid half-open frames.
      await page.screenshot({ path: output + "/menu-" + route.name + "-" + spec.width + "-open.png", animations: "disabled" });

      // Focus stays inside the modal panel, including wrap from the last element.
      const lastCTA = dialog.getByRole("link", { name: route.cta });
      if (spec.width === 320) {
        const ctaRect = await lastCTA.boundingBox();
        assert.ok(ctaRect && ctaRect.y + ctaRect.height <= spec.height - 4, "Small-phone menu action below first viewport: " + route.name);
      }
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
