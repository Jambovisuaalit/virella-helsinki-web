import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";
import { brandConfig } from "@/config/brand";
import { businessConfig } from "@/config/business";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-brand py-12 text-sm text-white/70 sm:py-14">
      <SectionContainer>
        <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white">{brandConfig.name}</p>
            </div>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/72">
              Selkeämpi verkkosivu. Vähemmän kitkaa ennen yhteydenottoa.
            </p>
            <p className="mt-5 text-xs leading-6 text-white/52">
              {businessConfig.legalName} · Y-tunnus {businessConfig.businessId} · {businessConfig.city}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <a
              href={`mailto:${businessConfig.email}`}
              className="font-bold text-white transition hover:text-white/80"
            >
              {businessConfig.email}
            </a>
            <Link href="/tietosuoja" className="text-xs font-semibold text-white/65 underline decoration-white/20 underline-offset-4 transition hover:text-white hover:decoration-white/50">
              Tietosuoja ja evästeet
            </Link>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
}
