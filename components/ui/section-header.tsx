import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, className = "" }: SectionHeaderProps) {
  return (
    <div className={`max-w-[720px] ${className}`}>
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand sm:text-sm">{eyebrow}</p>
      ) : null}
      <h2 className={`${eyebrow ? "mt-4 " : ""}text-3xl font-bold tracking-[-0.035em] sm:text-4xl`}>
        {title}
      </h2>
      {description ? <div className="mt-4 text-base leading-7 text-muted sm:text-lg">{description}</div> : null}
    </div>
  );
}
