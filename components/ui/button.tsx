import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  const styles =
    variant === "primary"
      ? "bg-action text-white shadow-[0_12px_30px_-16px_rgba(216,74,36,0.7)] hover:-translate-y-0.5 hover:brightness-[0.96]"
      : "border border-border/90 bg-surface/90 text-foreground shadow-[0_10px_28px_-22px_rgba(23,33,38,0.45)] hover:-translate-y-0.5 hover:border-brand/20 hover:bg-white";

  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-bold tracking-[-0.01em] transition duration-200 ${styles} ${className}`}
      {...props}
    />
  );
}
