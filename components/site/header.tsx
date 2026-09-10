import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <SectionContainer className="flex min-h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm font-extrabold uppercase tracking-[0.14em] text-brand sm:text-base"
        >
          Virella Helsinki
        </Link>

        <div className="flex items-center gap-4">
          <nav aria-label="Päänavigaatio" className="hidden items-center gap-5 text-sm font-medium text-muted sm:flex">
            <a href="#services" className="transition hover:text-foreground">
              Palvelumalli
            </a>
            <a href="#foundation" className="transition hover:text-foreground">
              Design
            </a>
          </nav>
          <span className="rounded-lg border border-brand/15 bg-brand/5 px-2.5 py-1 text-xs font-semibold text-brand">
            Preview
          </span>
        </div>
      </SectionContainer>
    </header>
  );
}
