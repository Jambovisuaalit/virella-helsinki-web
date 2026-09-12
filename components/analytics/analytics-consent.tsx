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
    <div className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl rounded-[1.6rem] border border-white/80 bg-background/94 p-4 shadow-[0_30px_90px_-34px_rgba(23,33,38,0.55)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-5" role="dialog" aria-label="Analytiikka-asetukset">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_0_5px_rgba(232,97,59,0.10)]" aria-hidden="true" />
        <div>
          <p className="font-extrabold tracking-[-0.015em] text-foreground">Analytiikka-asetukset</p>
          <p className="mt-1.5 text-sm leading-6 text-muted">
            Välttämättömät toiminnot ovat aina käytössä. Google Analytics käynnistyy vain, jos hyväksyt analytiikan. Lue lisää {" "}
            <Link href="/tietosuoja" className="font-bold text-brand underline decoration-brand/25 underline-offset-4">tietosuojasta</Link>.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={() => choose("denied")} className="min-h-11 rounded-full border border-border/90 bg-surface px-4 py-2.5 text-sm font-bold text-foreground transition hover:border-brand/20 hover:bg-white">
          Vain välttämättömät
        </button>
        <button type="button" onClick={() => choose("granted")} className="min-h-11 rounded-full bg-action px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_26px_-16px_rgba(216,74,36,0.7)] transition hover:brightness-[0.96]">
          Hyväksy analytiikka
        </button>
      </div>
    </div>
  );
}
