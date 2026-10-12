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
    <header className={`virella-site-header sticky top-0 bg-transparent pt-3 ${landing ? "landing-header" : ""}`}>
      <SectionContainer>
        <div className="virella-nav-shell flex items-center justify-between gap-2 px-3 backdrop-blur-md sm:gap-4 sm:px-6">
          <BrandLogo compact />
          <div className="flex min-w-0 items-center justify-end gap-3 sm:gap-4">
            <Link
              href={cta.href}
              className="ui-button ui-button--primary ui-button--compact hidden whitespace-nowrap lg:inline-flex"
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
