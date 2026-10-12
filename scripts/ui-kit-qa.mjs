import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const origin = process.env.VISUAL_QA_URL ?? 'http://127.0.0.1:3000';
const phase = process.env.UI_QA_PHASE ?? 'after';
const output = 'artifacts/visual-qa';
const verify = phase === 'after';
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const sizes = [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 1440, height: 900 }];
const routes = [
  { path: '/', name: 'home', card: '#palvelut' },
  { path: '/sosiaalinen-media', name: 'social', card: '#hinnoittelu' },
  { path: '/instagram', name: 'instagram', card: 'main section:first-child' },
  { path: '/linkedin', name: 'linkedin', card: 'main section:first-child' },
  { path: '/landing-page-seo', name: 'landing', card: 'main section:first-child' },
  { path: '/verkkosivu-kuntoon', name: 'conversion', card: 'main section:first-child' },
  { path: '/aloita?kartoitus=1', name: 'intake' },
];
const results = [];

async function open(spec, path, consent = 'denied') {
  const page = await browser.newPage({ viewport: spec, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  await page.addInitScript(value => {
    if (value) localStorage.setItem('virella_analytics_consent', value);
    else localStorage.removeItem('virella_analytics_consent');
  }, consent);
  // Screenshots must not send analytics or load third-party destinations.
  await page.route(/google-analytics\.com|googletagmanager\.com/, route => route.abort());
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const response = await page.goto(origin + path, { waitUntil: 'networkidle' });
  assert.equal(response?.status(), 200, path);
  await page.evaluate(() => document.fonts.ready);
  return { page, errors };
}
async function shot(page, name, fullPage = false) {
  await page.screenshot({ path: `${output}/ui-${phase}-${name}.png`, fullPage, animations: 'disabled' });
}
function check(value, message) { if (verify) assert.ok(value, message); }

try {
  for (const spec of sizes) {
    for (const route of routes) {
      const { page, errors } = await open(spec, route.path);
      const state = await page.evaluate(() => {
        const box = el => { const r = el.getBoundingClientRect(); return { x:r.x, y:r.y, right:r.right, bottom:r.bottom, width:r.width, height:r.height }; };
        const visible = el => getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
        const nav = document.querySelector('.virella-overlay-trigger');
        const logo = document.querySelector('header .brand-logo-image');
        const bar = document.querySelector('.virella-mobile-bar');
        const wa = document.querySelector('.virella-whatsapp-button');
        const primary = [...document.querySelectorAll('main .ui-button--primary')].filter(visible);
        return {
          width: innerWidth, documentWidth: document.documentElement.scrollWidth,
          sectionIds: [...document.querySelectorAll('main > section')].map(x => x.id),
          headings: [...document.querySelectorAll('main h1, main h2')].map(x => x.textContent.replace(/\s+/g,' ').trim()),
          h1Count: document.querySelectorAll('main h1').length,
          logo: box(logo), logoLoaded: logo.complete && logo.naturalWidth > 0, logoSrc: logo.getAttribute('src'), trigger: box(nav),
          buttons: primary.map(x => ({ ...box(x), background: getComputedStyle(x).backgroundColor, color: getComputedStyle(x).color, radius: getComputedStyle(x).borderRadius, font: getComputedStyle(x).fontFamily })),
          priceFonts: [...document.querySelectorAll('.ui-price')].map(x => getComputedStyle(x).fontFamily),
          bar: bar && visible(bar) ? box(bar) : null, whatsapp: wa && visible(wa) ? box(wa) : null,
          cards: [...document.querySelectorAll('main .ui-service-card')].map(x => ({ ...box(x), radius: getComputedStyle(x).borderRadius, border: getComputedStyle(x).borderColor })),
        };
      });
      check(state.documentWidth <= spec.width + 1, `${route.name}/${spec.width}: overflow ${state.documentWidth}`);
      check(state.h1Count === 1, `${route.name}: H1 count`);
      check(state.logoLoaded && state.logo.right < state.trigger.x - 3, `${route.name}/${spec.width}: logo/menu collision`);
      for (const b of state.buttons) {
        check(b.height >= 44 && b.x >= -1 && b.right <= spec.width + 1, `${route.name}/${spec.width}: CTA bounds`);
        check(b.background === 'rgb(199, 71, 39)' && b.radius === '8px', `${route.name}: primary tokens ${JSON.stringify(b)}`);
      }
      for (const c of state.cards) check(c.radius === '16px' && c.border === 'rgb(53, 64, 67)', `${route.name}: card tokens`);
      check(state.priceFonts.every(f => !/mono/i.test(f)), `${route.name}: price font`);
      if (state.bar && state.whatsapp) {
        check(state.bar.height <= 144, `${route.name}/${spec.width}: mobile bar exceeds reserve`);
        check(state.whatsapp.bottom <= state.bar.y, `${route.name}/${spec.width}: floating actions collide`);
      }
      await shot(page, `${route.name}-${spec.width}-hero`);
      await shot(page, `${route.name}-${spec.width}-full`, true);
      if (route.card) {
        await page.locator(route.card).screenshot({ path: `${output}/ui-${phase}-${route.name}-${spec.width}-cards.png`, animations: 'disabled' });
      }
      if (route.name === 'social') {
        await page.getByRole('button', { name: 'Valitse LinkedIn vertailuun' }).click();
        const button = page.getByRole('button', { name: 'Valitse LinkedIn vertailuun' });
        check(await button.getAttribute('aria-pressed') === 'true', 'LinkedIn selected state');
        await page.locator('#hinnoittelu').screenshot({ path: `${output}/ui-${phase}-social-${spec.width}-selected.png`, animations: 'disabled' });
      }
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
      if (verify && state.bar) {
        const footerVisible = await page.locator('footer a').last().evaluate(el => {
          const link = el.getBoundingClientRect(); const bar = document.querySelector('.virella-mobile-bar').getBoundingClientRect();
          return link.bottom <= bar.top;
        });
        check(footerVisible, `${route.name}/${spec.width}: footer covered by purchase bar`);
        await shot(page, `${route.name}-${spec.width}-footer`);
      }
      await page.evaluate(() => scrollTo(0, 0));
      if (route.name === 'home' || route.name === 'social' || route.name === 'linkedin') {
        const toggle = page.locator('.virella-overlay-trigger');
        await toggle.click();
        const dialog = page.getByRole('dialog', { name: 'Sivuston navigaatio' });
        check(await dialog.isVisible(), 'Menu open state');
        await shot(page, `${route.name}-${spec.width}-menu`);
        const close = dialog.getByRole('button', { name: 'Sulje valikko' });
        await close.focus();
        check(await close.evaluate(el => getComputedStyle(el).outlineStyle !== 'none'), 'Visible focus');
        await page.keyboard.press('Escape');
        check(await toggle.evaluate(el => el === document.activeElement), 'Menu focus restoration');
        check(await toggle.getAttribute('aria-expanded') === 'false', 'Menu closed state');
      }
      check(errors.length === 0, `${route.name}: ${errors.join('; ')}`);
      results.push({ phase, route: route.name, viewport: spec, ...state, errors });
      await page.close();
    }
    // Actual production consent UI, before making any choice.
    for (const route of [routes[0], routes[3]]) {
      const { page } = await open(spec, route.path, null);
      const consent = page.getByRole('dialog', { name: 'Analytiikka-asetukset' });
      assert.equal(await consent.count(), 1, 'Build QA with VERCEL_ENV=production to exercise consent');
      await shot(page, `${route.name}-${spec.width}-consent`);
      check(await consent.evaluate(el => {const r=el.getBoundingClientRect();return r.x >= 0 && r.right <= innerWidth && r.bottom <= innerHeight;}), 'Consent bounds');
      if (verify) {
        check(await page.locator('.virella-whatsapp-button').evaluate(el => getComputedStyle(el).visibility === 'hidden'), 'Consent hides WhatsApp');
        if (route.name === 'linkedin' && spec.width < 768) check(await page.locator('.virella-mobile-bar').evaluate(el => getComputedStyle(el).visibility === 'hidden'), 'Consent hides purchase bar');
      }
      await consent.getByRole('button', { name: 'Vain välttämättömät' }).click();
      check(await page.locator('.virella-whatsapp-button').isVisible(), 'Contact returns after consent');
      await page.close();
    }
  }
  if (verify) {
    const before = JSON.parse(readFileSync(`${output}/ui-before-summary.json`, 'utf8'));
    for (const state of results) {
      const prior = before.find(x => x.route === state.route && x.width === state.width);
      assert.deepEqual(state.sectionIds, prior.sectionIds, `${state.route}: section structure changed`);
      assert.deepEqual(state.headings, prior.headings, `${state.route}: heading content changed`);
      assert.equal(state.logoSrc, prior.logoSrc, `${state.route}: logo changed`);
    }
  }
  writeFileSync(`${output}/ui-${phase}-summary.json`, JSON.stringify(results, null, 2));
  console.log(`UI KIT ${phase.toUpperCase()} PASS: ${results.length} page/viewport cases, navigation and consent states`);
} finally { await browser.close(); }
