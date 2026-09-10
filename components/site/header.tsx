import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/95">
      <SectionContainer className="flex min-h-16 items-center justify-between gap-6">
        <Link href="/" className="font-semibold tracking-tight">
          Virella Helsinki
        </Link>
        <nav aria-label="Päänavigaatio" className="text-sm text-muted">
          <a href="#foundation" className="hover:text-foreground">
            Perusta
          </a>
        </nav>
      </SectionContainer>
    </header>
  );
}
