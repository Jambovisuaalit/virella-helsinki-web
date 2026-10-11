"use client";

import Link from "next/link";
import { useState } from "react";
import { products } from "@/config/products";
import { taxConfig } from "@/config/tax";
import { SocialIcon } from "@/components/site/social-icon";
import { trackAnalyticsEvent } from "@/lib/analytics/client";

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
  trackAnalyticsEvent("purchase_click", {
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
      <div className="sticky top-[88px] z-30 mb-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.55)] sm:top-[100px] lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="flex min-w-0 items-center gap-2 text-xs font-semibold text-zinc-300">
              <SocialIcon network={selectedChannel} width={16} height={16} className="shrink-0" />
              <span className="truncate">{channelDetails[selectedChannel].title}</span>
            </p>
            <p className="mt-1 whitespace-nowrap font-mono text-3xl leading-none text-cyan-400">
              {euro.format(selectedProduct.price)}
              <span className="ml-1 font-sans text-xs text-zinc-300">/ kk</span>
            </p>
          </div>
          <Link
            href={`/aloita?product=${selectedProduct.id}`}
            onClick={() => trackServiceRequest(selectedProduct.id)}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-cyan-400 px-3 py-2 text-center text-xs font-bold text-zinc-950 transition hover:bg-cyan-300 focus-visible:outline-offset-4 sm:px-4 sm:text-sm"
            aria-label={`Lähetä aloituspyyntö: ${channelDetails[selectedChannel].title}`}
          >
            Aloituspyyntö
          </Link>
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
              className={`flex min-w-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-8 ${selected ? "ring-1 ring-cyan-400/40" : ""}`}
              aria-labelledby={`plan-${channel}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-zinc-200" aria-hidden="true">
                      {channel === "instagram" ? (
                        <>
                          <SocialIcon network="instagram" />
                          <SocialIcon network="facebook" />
                        </>
                      ) : (
                        <SocialIcon network="linkedin" />
                      )}
                    </div>
                    <h3 id={`plan-${channel}`} className="text-xl font-semibold leading-snug text-zinc-100">
                      {description.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{description.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedChannel(channel)}
                aria-pressed={selected}
                aria-label={`Valitse ${description.title} vertailuun`}
                className="mt-5 inline-flex min-h-11 w-fit items-center rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 focus-visible:outline-offset-4"
              >
                {selected ? "Valittu kanava" : "Valitse kanava"}
              </button>

              <p className="mt-7 font-mono text-5xl leading-none tracking-tight text-cyan-400">
                {euro.format(product.price)}
                <span className="ml-2 font-sans text-sm font-normal tracking-normal text-zinc-400">/ kk</span>
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                {product.commitmentMonths} kk vähimmäisjakso · yhteensä {euro.format(product.totalPrice)}
              </p>

              <ul className="mt-7 space-y-3 border-t border-zinc-800 pt-6 text-sm leading-6 text-zinc-200">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-px font-semibold text-zinc-400">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <Link
                  href={`/aloita?product=${product.id}`}
                  onClick={() => trackServiceRequest(product.id)}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-cyan-400 px-4 py-3 text-center text-sm font-bold text-zinc-950 transition hover:bg-cyan-300 focus-visible:outline-offset-4"
                >
                  Lähetä aloituspyyntö
                  <span className="sr-only"> – {description.title}</span>
                </Link>
                <p className="mt-3 text-center text-xs leading-5 text-zinc-400">
                  Lähetät yhteydenottopyynnön, et maksullista tilausta.
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm leading-6 text-zinc-400">{taxConfig.publicMessage}</p>
    </div>
  );
}
