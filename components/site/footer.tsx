import { SectionContainer } from "@/components/layout/section-container";
import { brandConfig } from "@/config/brand";
import { businessConfig } from "@/config/business";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand/15 bg-brand py-10 text-sm text-white/75">
      <SectionContainer className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="font-semibold text-white">{brandConfig.name}</p>
          <p className="mt-2">{businessConfig.legalName} · Y-tunnus {businessConfig.businessId} · {businessConfig.city}</p>
        </div>
        <a
          href={`mailto:${businessConfig.email}`}
          className="font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
        >
          {businessConfig.email}
        </a>
      </SectionContainer>
    </footer>
  );
}
