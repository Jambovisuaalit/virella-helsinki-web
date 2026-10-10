import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";
import { brandConfig } from "@/config/brand";
import { BrandLogo } from "@/components/site/brand-logo";
import { businessConfig } from "@/config/business";

const externalProfiles = [
  { label: "Instagram", href: "https://www.instagram.com/virellahelsinki/" },
  // User-supplied Google share link: preserve unchanged until its final target can be verified.
  { label: "Google", href: "https://share.google/qVP543L22mML3yF6M" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface text-sm text-foreground">
      <SectionContainer className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-12 border-b border-border pb-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] sm:gap-14">
          <div className="max-w-[530px]">
            <BrandLogo inverse />
            <p className="mt-6 max-w-[460px] text-[15px] leading-7 text-muted">
              {brandConfig.positioning} {brandConfig.supportMessage}
            </p>
            <p className="mt-7 text-sm leading-7 text-muted">
              {businessConfig.contactName} · {businessConfig.contactTitle}<br />
              {businessConfig.legalName} · Y-tunnus {businessConfig.businessId}<br />
              {businessConfig.streetAddress}, {businessConfig.city}
            </p>
          </div>

          <div className="sm:justify-self-end">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Yhteystiedot</p>
            <div className="mt-4 flex flex-col items-start gap-1.5 sm:items-end">
              <a
                href={`tel:${businessConfig.phoneE164}`}
                className="inline-flex min-h-11 items-center text-base font-semibold text-foreground underline decoration-transparent underline-offset-4 transition-colors duration-150 hover:decoration-current focus-visible:decoration-current"
              >
                {businessConfig.phone}
              </a>
              <a
                href={`mailto:${businessConfig.email}`}
                className="inline-flex min-h-11 items-center text-base font-semibold text-foreground underline decoration-transparent underline-offset-4 transition-colors duration-150 hover:decoration-current focus-visible:decoration-current"
              >
                {businessConfig.email}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Virella Helsinki verkossa" className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="text-sm text-muted">Verkossa</span>
            {externalProfiles.map((profile) => (
              <a
                key={profile.href}
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-foreground focus-visible:decoration-foreground"
              >
                {profile.label}
                <span className="sr-only"> (avautuu uuteen välilehteen)</span>
              </a>
            ))}
          </nav>
          <Link
            href="/tietosuoja"
            className="inline-flex min-h-11 items-center self-start text-sm font-medium text-muted underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-foreground hover:decoration-foreground sm:self-auto"
          >
            Tietosuoja ja evästeet
          </Link>
        </div>
      </SectionContainer>
    </footer>
  );
}
