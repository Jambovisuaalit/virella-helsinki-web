import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface shadow-[0_8px_40px_-12px_rgba(31,36,46,0.12)] ${className}`}
      {...props}
    />
  );
}
