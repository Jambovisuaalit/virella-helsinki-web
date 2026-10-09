import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";
import { BrandLogo } from "@/components/site/brand-logo";
import { primaryNavigation } from "@/config/navigation";

const isPreview = process.env.VERCEL_ENV !== "production";

export function SiteHeader({ landing = false }: { landing?: boolean }) {
  if (landing) {
    return (
      <header className="landing-header">
        <SectionContainer>
          <div className="landing-header-inner">
            <BrandLogo landing />
            <nav aria-label="Päänavigaatio" className="landing-navigation"><a href="#prosessi">Näin toimii</a><a href="#hinnoittelu">Hinnoittelu</a></nav>
            <a href="#hinnoittelu" className="landing-header-cta">Valitse palvelu</a>
          </div>
        </SectionContainer>
      </header>
    );
  }
  return (
    <header className="sticky top-0 z-50 bg-transparent pt-3">
      <SectionContainer>
        <div className="flex min-h-14 items-center justify-between gap-4 rounded-full border border-border/80 bg-background/88 px-4 shadow-[0_16px_50px_-32px_rgba(23,33,38,0.5)] backdrop-blur-xl sm:px-5">
          <Link
            href="/"
            className="inline-flex items-center" aria-label="Virella Helsinki – etusivu"
          >
            <BrandLogo compact linked={false} />
          </Link>

          <div className="flex items-center gap-3">
            <nav aria-label="Päänavigaatio" className="hidden items-center gap-1 text-sm font-semibold text-muted sm:flex">
              {primaryNavigation.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 transition hover:bg-surface hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </nav>
            {isPreview ? (
              <span className="rounded-full border border-brand/15 bg-brand/5 px-2.5 py-1 text-xs font-semibold text-brand">
                Preview
              </span>
            ) : null}
          </div>
        </div>
      </SectionContainer>
    </header>
  );
}
