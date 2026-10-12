"use client";

import { trackAnalyticsEvent } from "@/lib/analytics/client";
import { requiresWrittenOffer } from "@/config/offer-master";

const defaultButtonClassName =
  "ui-button ui-button--primary w-full sm:w-auto";

type BuyButtonProps = {
  productId: string;
  label?: string;
  className?: string;
  buttonClassName?: string;
  source?: string;
};

export function BuyButton({
  productId,
  label = "Aloita tästä",
  className = "",
  buttonClassName = defaultButtonClassName,
  source = "service_page",
}: BuyButtonProps) {
  const writtenOffer = requiresWrittenOffer(productId);
  const visibleLabel = writtenOffer ? "Aloita yhteistyö" : /^Osta\b/i.test(label) ? "Aloita tästä" : label;

  function handleSubmit() {
    trackAnalyticsEvent("purchase_click", { productId, source });
  }

  if (writtenOffer) {
    return (
      <div className={className}>
        <a
          href={`/aloita?product=${encodeURIComponent(productId)}`}
          onClick={() => trackAnalyticsEvent("offer_request_click", { productId, source })}
          className={buttonClassName}
        >
          {visibleLabel}
        </a>
      </div>
    );
  }

  return (
    <form action="/api/checkout" method="post" className={className} onSubmit={handleSubmit}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit" className={buttonClassName}>
        {visibleLabel}
      </button>
    </form>
  );
}
