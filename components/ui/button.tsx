import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  const styles =
    variant === "primary"
      ? "bg-action text-white hover:brightness-90"
      : "border border-border bg-surface text-foreground hover:bg-cloud";

  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${styles} ${className}`}
      {...props}
    />
  );
}
