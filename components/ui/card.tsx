import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-[1.5rem] border border-border/80 bg-surface shadow-[0_18px_60px_-36px_rgba(23,33,38,0.38)] ${className}`}
      {...props}
    />
  );
}
