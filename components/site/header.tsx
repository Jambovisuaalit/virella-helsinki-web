import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";
import { BrandLogo } from "@/components/site/brand-logo";
import { OverlayNavigation } from "@/components/site/overlay-navigation";
import { primaryNavigation } from "@/config/navigation";

const socialNavigation = [
  { label: "Etusivu", href: "/" },
  { label: "Esimerkki", href: "#todisteet" },
  { label: "Näin toimii", href: "#prosessi" },
  { label: "Hinnoittelu", href: "#hinnoittelu" },
] as const;

export function SiteHeader({ landing = false }: { landing?: boolean }) {
  const items = landing ? socialNavigation : [
    { label: "Etusivu", href: "/" },
    ...primaryNavigation,
  ];
  const cta = landing
    ? { label: "Katso palvelut ja hinnat", href: "#hinnoittelu" }
    : { label: "Pyydä maksuton näkyvyyskartoitus", href: "/aloita?kartoitus=1" };

  return (
    <header className={`virella-site-header sticky top-0 z-[100] bg-transparent pt-3 ${landing ? "landing-header" : ""}`}>
      <SectionContainer>
        <div className="virella-nav-shell grid min-h-[72px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-2xl border border-border/80 bg-surface/95 px-3 shadow-[0_12px_38px_-28px_rgba(0,0,0,0.7)] backdrop-blur-md sm:gap-5 sm:px-6">
          <div className="flex min-w-0 items-center justify-start">
            <Link
              href={cta.href}
              className={`hidden min-h-11 items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-offset-4 lg:inline-flex ${landing ? "bg-cyan-400 text-zinc-950 hover:bg-cyan-300" : "bg-action text-white hover:bg-[#ac381d]"}`}
            >
              {landing ? "Katso hinnat" : "Maksuton kartoitus"}
            </Link>
          </div>
          <div className="flex min-w-0 items-center justify-center">
            <BrandLogo compact />
          </div>
          <div className="flex min-w-0 items-center justify-end">
            <OverlayNavigation items={items} cta={cta} social={landing} />
          </div>
        </div>
      </SectionContainer>
    </header>
  );
}
