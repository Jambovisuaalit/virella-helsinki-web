"use client";

import { ButtonLink } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { useState } from "react";
import { products } from "@/config/products";
import { taxConfig } from "@/config/tax";
import { SocialIcon } from "@/components/site/social-icon";
import { trackAnalyticsEvent } from "@/lib/analytics/client";
import { requiresWrittenOffer } from "@/config/offer-master";

const euro = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

type Channel = "instagram" | "linkedin";
const channels: Channel[] = ["instagram", "linkedin"];

const channelDetails: Record<Channel, { title: string; description: string }> = {
  instagram: {
    title: "Instagram + Facebook",
    description: "Näytä yrityksesi tekeminen ja pidä kanavat aktiivisina.",
  },
  linkedin: {
    title: "LinkedIn",
    description: "Tuo osaaminen ja asiantuntemus esiin ammatillisessa verkostossa.",
  },
};

function trackServiceRequest(productId: string) {
  trackAnalyticsEvent(requiresWrittenOffer(productId) ? "offer_request_click" : "purchase_click", {
    productId,
    source: "social_landing_pricing",
  });
}

export function SocialPricingCard() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>("instagram");
  const selectedProduct = products[selectedChannel];

  return (
    <div className="w-full min-w-0">
      {/* A compact sticky price card keeps the action available without covering
          the full mobile viewport or hiding the other plan. */}
      <div className="virella-social-sticky sticky ui-card mb-5 p-4 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="flex min-w-0 items-center gap-2 text-xs font-semibold text-muted">
              <SocialIcon network={selectedChannel} width={16} height={16} className="shrink-0" />
              <span className="truncate">{channelDetails[selectedChannel].title}</span>
            </p>
            <PriceDisplay className="mt-1" amount={selectedProduct.price} size="compact" suffix={selectedProduct.price !== null ? "/ kk" : undefined} />
          </div>
          <ButtonLink
            href={`/aloita?product=${selectedProduct.id}`}
            onClick={() => trackServiceRequest(selectedProduct.id)}
            className="ui-button--compact shrink-0"
            aria-label={`Aloita yhteistyö: ${channelDetails[selectedChannel].title}`}
          >
            Aloita yhteistyö
          </ButtonLink>
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        {channels.map((channel) => {
          const product = products[channel];
          const selected = channel === selectedChannel;
          const description = channelDetails[channel];

          return (
            <article
              key={channel}
              className={`ui-card ui-service-card flex min-w-0 flex-col ${selected ? "ring-1 ring-brand/40" : ""}`}
              aria-labelledby={`plan-${channel}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-foreground" aria-hidden="true">
                      {channel === "instagram" ? (
                        <>
                          <SocialIcon network="instagram" />
                          <SocialIcon network="facebook" />
                        </>
                      ) : (
                        <SocialIcon network="linkedin" />
                      )}
                    </div>
                    <h3 id={`plan-${channel}`} className="ui-heading-card text-foreground">
                      {description.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{description.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedChannel(channel)}
                aria-pressed={selected}
                aria-label={`Valitse ${description.title} vertailuun`}
                className="ui-button ui-button--secondary ui-button--compact mt-5 w-fit"
              >
                {selected ? "Valittu kanava" : "Valitse kanava"}
              </button>

              <PriceDisplay className="mt-7" amount={product.price} suffix={product.price !== null ? "/ kk" : undefined} />
              <p className="mt-3 text-sm leading-6 text-muted">
                {product.billing === "quote" ? "Julkaisumäärä, hinta ja sopimuskausi sovitaan kirjallisessa tarjouksessa." : `${product.commitmentMonths} kk vähimmäisjakso · yhteensä ${euro.format(product.totalPrice)}`}
              </p>

              <ul className="mt-7 space-y-3 border-t border-border pt-6 text-sm leading-6 text-foreground">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-px font-semibold text-muted">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <ButtonLink
                  href={`/aloita?product=${product.id}`}
                  onClick={() => trackServiceRequest(product.id)}
                  className="w-full"
                >
                  Aloita yhteistyö
                  <span className="sr-only"> – {description.title}</span>
                </ButtonLink>
                <p className="mt-3 text-center text-xs leading-5 text-muted">
                  Lähetät yhteydenottopyynnön, et maksullista tilausta.
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm leading-6 text-muted">{taxConfig.publicMessage}</p>
    </div>
  );
}
