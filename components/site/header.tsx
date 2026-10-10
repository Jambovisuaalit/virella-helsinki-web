import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";
import { BrandLogo } from "@/components/site/brand-logo";
import { MobileNavigation } from "@/components/site/mobile-navigation";
import { primaryNavigation } from "@/config/navigation";

const isPreview = process.env.VERCEL_ENV !== "production";

const socialNavigation = [
  { label: "Etusivu", href: "/" },
  { label: "Esimerkki", href: "#todisteet" },
  { label: "Näin toimii", href: "#prosessi" },
  { label: "Hinnoittelu", href: "#hinnoittelu" },
] as const;

export function SiteHeader({ landing = false }: { landing?: boolean }) {
  if (landing) {
    return (
      <header className="landing-header">
        <SectionContainer>
          <div className="landing-header-inner relative">
            <BrandLogo landing />
            <nav aria-label="Päänavigaatio" className="landing-navigation">
              {socialNavigation.filter((item) => item.label !== "Esimerkki").map((item) => (
                <Link key={item.href} href={item.href}>{item.label}</Link>
              ))}
            </nav>
            <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
              <MobileNavigation items={socialNavigation} cta={{ label: "Katso palvelut ja hinnat", href: "#hinnoittelu" }} social />
              <a href="#hinnoittelu" className="landing-header-cta">
                <span className="sm:hidden">Hinnat</span>
                <span className="hidden sm:inline">Katso hinnat</span>
              </a>
            </div>
          </div>
        </SectionContainer>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-transparent pt-3">
      <SectionContainer>
        <div className="relative flex min-h-14 items-center justify-between gap-2 rounded-full border border-border/80 bg-background/95 px-3 shadow-[0_16px_50px_-32px_rgba(23,33,38,0.5)] backdrop-blur-xl sm:gap-4 sm:px-5">
          <BrandLogo compact />
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <nav aria-label="Päänavigaatio" className="hidden items-center gap-1 text-sm font-semibold text-muted lg:flex">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-full px-3 py-2 transition hover:bg-surface hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <MobileNavigation
              items={primaryNavigation}
              cta={{ label: "Pyydä maksuton näkyvyyskartoitus", href: "/aloita?kartoitus=1" }}
            />
            <Link
              href="/aloita?kartoitus=1"
              className="hidden min-h-11 items-center justify-center rounded-lg bg-action px-3 py-2 text-sm font-bold text-white transition hover:brightness-95 sm:inline-flex sm:px-4"
            >
              Pyydä maksuton kartoitus
            </Link>
            {isPreview ? (
              <span className="hidden rounded-full border border-brand/15 bg-brand/5 px-2.5 py-1 text-xs font-semibold text-brand xl:inline-flex">
                Preview
              </span>
            ) : null}
          </div>
        </div>
      </SectionContainer>
    </header>
  );
}
