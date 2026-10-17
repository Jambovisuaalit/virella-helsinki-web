"use client";

import { useState } from "react";

export function WebsiteField({ audit, className }: { audit: boolean; className: string }) {
  const [noWebsite, setNoWebsite] = useState(false);
  return (
    <div>
      <label htmlFor="website" className="text-sm font-bold">{audit && !noWebsite ? "Verkkosivun osoite *" : "Verkkosivu"}</label>
      <input id="website" name="website" type="url" required={audit && !noWebsite} disabled={noWebsite} maxLength={300} placeholder="https://yritys.fi" className={`${className} disabled:opacity-50`} aria-describedby="website-help" />
      <label className="mt-3 flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" name="noWebsite" value="yes" checked={noWebsite} onChange={(event) => setNoWebsite(event.target.checked)} className="h-5 w-5 accent-action" />
        Yritykselläni ei vielä ole verkkosivuja
      </label>
      <p id="website-help" className="mt-2 text-sm leading-6 text-muted">{noWebsite ? "Kerro yrityksesi nimi alla. Kartoitamme julkisen Google-näkyvyyden ja verkkosivun tärkeimmät lähtökohdat." : "Voit pyytää kartoituksen myös ilman verkkosivuja valitsemalla yllä olevan kohdan."}</p>
    </div>
  );
}
