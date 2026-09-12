import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";
import { brandConfig } from "@/config/brand";
import { primaryNavigation } from "@/config/navigation";

const isPreview = process.env.VERCEL_ENV !== "production";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-transparent pt-3">
      <SectionContainer>
        <div className="flex min-h-14 items-center justify-between gap-4 rounded-full border border-border/80 bg-background/88 px-4 shadow-[0_16px_50px_-32px_rgba(23,33,38,0.5)] backdrop-blur-xl sm:px-5">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-brand sm:text-sm"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(232,97,59,0.10)] transition group-hover:scale-110" aria-hidden="true" />
            {brandConfig.name}
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
