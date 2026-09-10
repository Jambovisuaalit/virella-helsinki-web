import { SectionContainer } from "@/components/layout/section-container";
import { brandConfig } from "@/config/brand";
import { businessConfig } from "@/config/business";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand/15 bg-brand py-10 text-sm text-white/75">
      <SectionContainer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-white">{brandConfig.name}</p>
        <p>{businessConfig.legalName} · {businessConfig.city}</p>
      </SectionContainer>
    </footer>
  );
}
