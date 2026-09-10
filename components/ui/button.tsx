import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  const styles =
    variant === "primary"
      ? "bg-brand text-brand-foreground hover:opacity-90"
      : "border border-border bg-surface text-foreground hover:bg-background";

  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${styles} ${className}`}
      {...props}
    />
  );
}
