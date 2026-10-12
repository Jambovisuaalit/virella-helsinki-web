"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { initializeAnalytics } from "@/lib/analytics/client";

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

export function AnalyticsConsent({ enabled }: { enabled: boolean }) {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, getServerConsent);

  useEffect(() => {
    if (enabled && consent === "granted") initializeAnalytics();
  }, [consent, enabled]);

  if (!enabled || consent !== null) return null;

  function choose(value: Exclude<Consent, null>) {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  return (
    <div className="virella-consent ui-card fixed inset-x-3 bottom-3 mx-auto max-w-xl p-4 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-5" role="dialog" aria-label="Analytiikka-asetukset">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_0_5px_rgba(232,97,59,0.10)]" aria-hidden="true" />
        <div>
          <p className="font-extrabold tracking-[-0.015em] text-foreground">Analytiikka-asetukset</p>
          <p className="mt-1.5 text-sm leading-6 text-muted">
            Välttämättömät toiminnot ovat aina käytössä. Google Analytics käynnistyy vain, jos hyväksyt analytiikan. Lue lisää{" "}
            <Link href="/tietosuoja" className="font-bold text-brand underline decoration-brand/25 underline-offset-4">tietosuojasta</Link>.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={() => choose("denied")} className="ui-button ui-button--secondary">
          Vain välttämättömät
        </button>
        <button type="button" onClick={() => choose("granted")} className="ui-button ui-button--primary ">
          Hyväksy analytiikka
        </button>
      </div>
    </div>
  );
}
