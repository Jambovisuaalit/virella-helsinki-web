import type { HTMLAttributes } from "react";

type SectionContainerProps = HTMLAttributes<HTMLDivElement>;

export function SectionContainer({ className = "", ...props }: SectionContainerProps) {
  return (
    <div
      className={`ui-container ${className}`}
      {...props}
    />
  );
}
