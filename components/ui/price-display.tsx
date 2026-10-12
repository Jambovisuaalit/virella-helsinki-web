import type { HTMLAttributes } from "react";

const euro = new Intl.NumberFormat("fi-FI", {
  style: "currency", currency: "EUR", maximumFractionDigits: 0,
});

type PriceDisplayProps = HTMLAttributes<HTMLParagraphElement> & {
  amount: number | string | null;
  suffix?: string;
  size?: "large" | "small" | "compact";
};

export function PriceDisplay({ amount, suffix, size = "large", className = "", ...props }: PriceDisplayProps) {
  const displayAmount = amount === null ? "Tarjouksen mukaan" : typeof amount === "number" ? euro.format(amount)
    : amount.replace(/\d[\d\s]*€/g, value => value.replace(/\s/g, "\u00a0"));
  return (
    <p className={`ui-price ui-price--${size} ${amount === null ? "ui-price--quote" : ""} ${className}`} {...props}>
      <span>{displayAmount}</span>
      {suffix ? <span className="ui-price-suffix">{suffix}</span> : null}
    </p>
  );
}
