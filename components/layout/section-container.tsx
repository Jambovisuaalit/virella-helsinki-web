import type { HTMLAttributes } from "react";

type SectionContainerProps = HTMLAttributes<HTMLDivElement>;

export function SectionContainer({ className = "", ...props }: SectionContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 ${className}`}
      {...props}
    />
  );
}
