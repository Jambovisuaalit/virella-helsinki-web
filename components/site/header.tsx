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
        <div className="virella-nav-shell flex min-h-[68px] items-center justify-between gap-3 rounded-2xl border border-border bg-surface/95 px-4 shadow-[0_12px_38px_-24px_rgba(0,0,0,0.75)] backdrop-blur-md sm:px-6">
          <BrandLogo compact />
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <Link
              href={cta.href}
              className={`hidden min-h-11 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold transition-colors duration-200 focus-visible:outline-offset-4 sm:inline-flex ${landing ? "bg-cyan-400 text-zinc-950 hover:bg-cyan-300" : "bg-action text-white hover:bg-[#ac381d]"}`}
            >
              {landing ? "Katso hinnat" : "Maksuton kartoitus"}
            </Link>
            <OverlayNavigation items={items} cta={cta} social={landing} />
          </div>
        </div>
      </SectionContainer>
    </header>
  );
}
