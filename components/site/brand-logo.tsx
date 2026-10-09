import Link from "next/link";

type Props = { landing?: boolean; compact?: boolean; inverse?: boolean; linked?: boolean };

export function BrandLogo({ landing = false, compact = false, inverse = false, linked = true }: Props) {
  const className = ["brand-logo", landing && "brand-logo--landing", compact && "brand-logo--compact", inverse && "brand-logo--inverse"].filter(Boolean).join(" ");
  const content = <>
    <span className="brand-logo-mark" aria-hidden="true">V</span>
    <span className="brand-logo-name">Virella<small>Helsinki</small></span>
  </>;
  if (!linked) return <span className={className}>{content}</span>;
  return <Link href="/" className={className} aria-label="Virella Helsinki – etusivu">{content}</Link>;
}
