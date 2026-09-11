"use client";

import { trackAnalyticsEvent } from "@/lib/analytics/client";

const defaultButtonClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-action px-5 py-3 text-sm font-bold text-white transition hover:brightness-90 sm:w-auto";

type BuyButtonProps = {
  productId: string;
  label?: string;
  className?: string;
  buttonClassName?: string;
  source?: string;
};

export function BuyButton({
  productId,
  label = "Osta nyt",
  className = "",
  buttonClassName = defaultButtonClassName,
  source = "service_page",
}: BuyButtonProps) {
  function handleSubmit() {
    trackAnalyticsEvent("purchase_click", { productId, source });
    trackAnalyticsEvent("checkout_started", { productId, source });
  }

  return (
    <form action="/api/checkout" method="post" className={className} onSubmit={handleSubmit}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit" className={buttonClassName}>
        {label}
      </button>
    </form>
  );
}
