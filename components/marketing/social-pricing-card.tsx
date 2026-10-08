"use client";

import { useState } from "react";
import { products } from "@/config/products";
import { taxConfig } from "@/config/tax";
import { trackAnalyticsEvent } from "@/lib/analytics/client";

const euro = new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function SocialPricingCard() {
  const [channel, setChannel] = useState<"instagram" | "linkedin">("instagram");
  const product = products[channel];
  return (
    <div className="landing-price-card">
      <form action="/aloita" method="get" onSubmit={() => trackAnalyticsEvent("purchase_click", { productId: product.id, source: "homepage_pricing" })}>
        <fieldset className="landing-channel-choice"><legend>Valitse kanava</legend><div>{(["instagram", "linkedin"] as const).map((value) => <label key={value} className={channel === value ? "is-selected" : ""}><input type="radio" name="product" value={products[value].id} checked={channel === value} onChange={() => setChannel(value)} /><span>{value === "instagram" ? "Instagram" : "LinkedIn"}</span></label>)}</div></fieldset>
        <div className="landing-price-content" aria-live="polite" aria-atomic="true">
          <h3>{channel === "instagram" ? "Instagram-palvelu" : "LinkedIn-palvelu"}</h3>
          <p className="landing-price-amount">{euro.format(product.price)}<span> / kk</span></p>
          <p className="landing-price-commitment">{product.commitmentMonths} kk minimi · yhteensä {euro.format(product.totalPrice)}</p>
          <ul>{product.features.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
        </div>
        <button className="landing-primary landing-price-button" type="submit">Aloita yhteistyö</button>
        <p className="landing-price-next">Lähetä aloituspyyntö. Vahvistamme lähtötiedot ja seuraavat vaiheet sähköpostilla.</p>
        <p className="landing-tax">{taxConfig.publicMessage}</p>
      </form>
    </div>
  );
}
