import Image from "next/image";
import Link from "next/link";

type Props = { landing?: boolean; compact?: boolean; inverse?: boolean; linked?: boolean };

export function BrandLogo({ landing = false, compact = false, inverse = false, linked = true }: Props) {
  const className = ["brand-logo", landing && "brand-logo--landing", compact && "brand-logo--compact", inverse && "brand-logo--inverse"].filter(Boolean).join(" ");
  const content = <Image src="/brand/virella-wordmark.webp" alt="Virella Helsinki" width={720} height={233} className="brand-logo-image" priority={landing || compact} unoptimized />;
  if (!linked) return <span className={className}>{content}</span>;
  return <Link href="/" className={className} aria-label="Virella Helsinki – etusivu">{content}</Link>;
}
