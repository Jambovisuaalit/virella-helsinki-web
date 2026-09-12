"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "virella_analytics_consent";
const CONSENT_EVENT = "virella:analytics-consent";

type Consent = "granted" | "denied" | null;

function readConsent(): Consent {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "granted" || stored === "denied" ? stored : null;
}

function getServerConsent(): Consent {
  return null;
}

function subscribeConsent(listener: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CONSENT_EVENT, listener);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CONSENT_EVENT, listener);
  };
}

function removeGaCookies() {
  const rootDomain = window.location.hostname.replace(/^www\./, "");
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${rootDomain}; SameSite=Lax`;
  }
}

export function AnalyticsPreferences() {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, getServerConsent);

  function update(value: Exclude<Consent, null>) {
    window.localStorage.setItem(STORAGE_KEY, value);
    if (value === "denied") removeGaCookies();
    window.dispatchEvent(new Event(CONSENT_EVENT));
    if (value === "denied") window.location.reload();
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="font-bold text-foreground">Analytiikka-asetukset</p>
      <p className="mt-2 text-sm leading-6 text-muted">
        Nykyinen valinta: <strong className="text-foreground">{consent === "granted" ? "analytiikka sallittu" : consent === "denied" ? "vain välttämättömät" : "ei valintaa"}</strong>.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => update("denied")} className="min-h-11 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-cloud">
          Vain välttämättömät
        </button>
        <button type="button" onClick={() => update("granted")} className="min-h-11 rounded-xl bg-action px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-90">
          Hyväksy analytiikka
        </button>
      </div>
    </div>
  );
}
