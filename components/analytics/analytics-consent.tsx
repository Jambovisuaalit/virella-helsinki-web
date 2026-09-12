"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "virella_analytics_consent";
const GA_MEASUREMENT_ID = "G-43VQ8505YL";

type Consent = "granted" | "denied" | null;
type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function loadGa4() {
  const target = window as GtagWindow;
  target.dataLayer ||= [];
  target.gtag ||= (...args: unknown[]) => {
    target.dataLayer?.push(args);
  };

  target.gtag("js", new Date());
  target.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  if (!document.getElementById("virella-ga4-script")) {
    const script = document.createElement("script");
    script.id = "virella-ga4-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }
}

export function AnalyticsConsent({ enabled }: { enabled: boolean }) {
  const [consent, setConsent] = useState<Consent>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "granted" || stored === "denied") setConsent(stored);
    setHydrated(true);
  }, [enabled]);

  useEffect(() => {
    if (enabled && consent === "granted") loadGa4();
  }, [consent, enabled]);

  if (!enabled || !hydrated || consent !== null) return null;

  function choose(value: Exclude<Consent, null>) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    window.dispatchEvent(new Event("virella:analytics-consent"));
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-5 shadow-[0_24px_80px_-30px_rgba(31,36,46,0.45)] sm:inset-x-6 sm:bottom-6 sm:p-6" role="dialog" aria-label="Analytiikka-asetukset">
      <p className="font-extrabold text-foreground">Analytiikka-asetukset</p>
      <p className="mt-2 text-sm leading-6 text-muted">
        Välttämättömät toiminnot ovat aina käytössä. Google Analytics käynnistyy vain, jos hyväksyt analytiikan. Lue lisää {" "}
        <Link href="/tietosuoja" className="font-semibold text-brand underline underline-offset-4">tietosuojasta</Link>.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={() => choose("denied")} className="min-h-12 rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-foreground transition hover:bg-cloud">
          Vain välttämättömät
        </button>
        <button type="button" onClick={() => choose("granted")} className="min-h-12 rounded-xl bg-action px-4 py-3 text-sm font-bold text-white transition hover:brightness-90">
          Hyväksy analytiikka
        </button>
      </div>
    </div>
  );
}
