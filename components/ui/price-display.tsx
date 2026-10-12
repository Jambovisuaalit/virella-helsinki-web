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
  return (
    <p className={`ui-price ui-price--${size} ${amount === null ? "ui-price--quote" : ""} ${className}`} {...props}>
      <span>{amount === null ? "Tarjouksen mukaan" : typeof amount === "number" ? euro.format(amount) : amount}</span>
      {suffix ? <span className="ui-price-suffix">{suffix}</span> : null}
    </p>
  );
}
