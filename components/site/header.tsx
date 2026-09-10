import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";
import { brandConfig } from "@/config/brand";
import { primaryNavigation } from "@/config/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <SectionContainer className="flex min-h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm font-extrabold uppercase tracking-[0.14em] text-brand sm:text-base"
        >
          {brandConfig.name}
        </Link>

        <div className="flex items-center gap-4">
          <nav aria-label="Päänavigaatio" className="hidden items-center gap-5 text-sm font-medium text-muted sm:flex">
            {primaryNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="rounded-lg border border-brand/15 bg-brand/5 px-2.5 py-1 text-xs font-semibold text-brand">
            Preview
          </span>
        </div>
      </SectionContainer>
    </header>
  );
}
