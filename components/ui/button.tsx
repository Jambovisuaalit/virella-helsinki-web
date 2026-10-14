import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  const styles =
    variant === "primary"
      ? "bg-action text-white shadow-sm hover:bg-[#ac381d] active:translate-y-px"
      : "border border-border bg-surface text-foreground hover:border-brand hover:bg-mist active:translate-y-px";

  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center rounded-lg px-5 py-3 text-sm font-bold tracking-[-0.01em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${styles} ${className}`}
      {...props}
    />
  );
}
