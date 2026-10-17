import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const code = ts.transpileModule(readFileSync(new URL('../lib/analytics/client.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function client({ consent = 'granted', session = new Map(), blockedStorage = false } = {}) {
  const events = [];
  let permission = consent;
  const loadedModule = { exports: {} };
  vm.runInNewContext(code, {
    module: loadedModule, exports: loadedModule.exports, URL, document: { title: "Virella" },
    window: {
      location: { href: 'https://virella.example/aloita?kartoitus=1&submitted=1&receipt=private-proof&utm_campaign=website-pilot', pathname: '/aloita' },
      localStorage: { getItem: () => permission },
      sessionStorage: {
        getItem(key) { if (blockedStorage) throw new Error('blocked'); return session.get(key); },
        setItem(key, value) { if (blockedStorage) throw new Error('blocked'); session.set(key, value); },
      },
      gtag: (...args) => events.push(args),
    },
  });
  return { ...loadedModule.exports, events, grant() { permission = 'granted'; }, session };
}

test('conversion is queued only after consent and once per receipt, including a reload', () => {
  const first = client({ consent: 'denied' });
  assert.equal(first.trackAnalyticsEvent('contact_submit', { source: 'visibility_audit' }, 'receipt-1'), false);
  assert.equal(first.events.length, 0);
  assert.equal(first.session.size, 0);
  first.grant();
  assert.equal(first.trackAnalyticsEvent('contact_submit', { source: 'visibility_audit' }, 'receipt-1'), true);
  assert.equal(first.trackAnalyticsEvent('contact_submit', {}, 'receipt-1'), false);
  const reloaded = client({ session: first.session });
  assert.equal(reloaded.trackAnalyticsEvent('contact_submit', {}, 'receipt-1'), false);
  assert.equal(reloaded.trackAnalyticsEvent('contact_submit', {}, 'receipt-2'), true);
  assert.equal(first.events.length + reloaded.events.length, 2);
});

test('receipt proof is omitted from GA payload while campaign attribution is preserved', () => {
  const api = client();
  api.trackAnalyticsEvent('contact_submit', {}, 'receipt-3');
  const payload = api.events[0][2];
  assert.equal(new URL(payload.page_location).searchParams.get('utm_campaign'), 'website-pilot');
  assert.equal(new URL(payload.page_location).searchParams.has('receipt'), false);
  assert.equal(new URL(payload.page_location).searchParams.has('submitted'), false);
  assert.equal(JSON.stringify(api.events).includes('private-proof'), false);
  assert.equal(JSON.stringify(api.events).includes('receipt-3'), false);
});

test('disabled session storage preserves in-memory deduplication without throwing', () => {
  const api = client({ blockedStorage: true });
  assert.equal(api.trackAnalyticsEvent('contact_submit', {}, 'receipt-4'), true);
  assert.equal(api.trackAnalyticsEvent('contact_submit', {}, 'receipt-4'), false);
});

test('ordinary page views are not deduplicated across navigation', () => {
  const api = client();
  api.trackAnalyticsEvent('page_view');
  api.trackAnalyticsEvent('page_view');
  assert.equal(api.events.length, 2);
});

test('mounted funnel retries after consent and removes its listener on unmount', () => {
  const api = client({ consent: 'denied' });
  const listeners = new Map();
  let cleanup;
  const loadedModule = { exports: {} };
  const componentCode = ts.transpileModule(readFileSync(new URL('../components/analytics/funnel-event.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(componentCode, {
    module: loadedModule, exports: loadedModule.exports,
    require(name) {
      if (name === 'react') return { useEffect(callback) { cleanup = callback(); } };
      if (name === '@/lib/analytics/client') return api;
      throw new Error(`Unexpected dependency: ${name}`);
    },
    window: {
      addEventListener(name, listener) { listeners.set(name, listener); },
      removeEventListener(name, listener) { if (listeners.get(name) === listener) listeners.delete(name); },
    },
  });
  loadedModule.exports.FunnelEvent({ name: 'contact_submit', eventId: 'receipt-5' });
  assert.equal(api.events.length, 0);
  api.grant();
  listeners.get('virella:analytics-consent')();
  listeners.get('virella:analytics-consent')();
  assert.equal(api.events.length, 1);
  cleanup();
  assert.equal(listeners.size, 0);
});
