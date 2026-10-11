"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { BrandLogo } from "@/components/site/brand-logo";

export type OverlayNavigationItem = {
  label: string;
  href: string;
};

type Props = {
  items: readonly OverlayNavigationItem[];
  cta: OverlayNavigationItem;
  social?: boolean;
};

export function OverlayNavigation({ items, cta, social = false }: Props) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogId = useId().replace(/:/g, "");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousPathname = useRef(pathname);

  const dismiss = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    // The full-screen panel is rendered into body, outside the sticky header's
    // stacking context. Keep server and client markup equivalent until mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const priorOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss(true);
        return;
      }

      if (event.key !== "Tab" || !overlayRef.current) return;

      const elements = [...overlayRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )].filter((element) => element.getClientRects().length > 0);
      if (!elements.length) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || !overlayRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !overlayRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeydown);
    return () => {
      body.style.overflow = priorOverflow;
      document.removeEventListener("keydown", onKeydown);
    };
  }, [isOpen, dismiss]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-label={isOpen ? "Sulje valikko" : "Avaa valikko"}
        aria-expanded={isOpen}
        aria-controls={dialogId}
        onClick={() => {
          if (isOpen) dismiss(true);
          else setIsOpen(true);
        }}
        className="virella-overlay-trigger inline-flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-full border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-zinc-500 hover:bg-mist focus-visible:outline-offset-4"
      >
        <span className="hidden sm:inline">{isOpen ? "Sulje" : "Valikko"}</span>
        <span aria-hidden="true" className={`virella-hamburger ${isOpen ? "is-open" : ""}`}>
          <span />
          <span />
        </span>
      </button>

      {mounted ? createPortal(
        <div
          ref={overlayRef}
          id={dialogId}
          role="dialog"
          aria-modal={isOpen ? "true" : undefined}
          aria-label="Sivuston navigaatio"
          aria-hidden={!isOpen}
          inert={!isOpen}
          data-open={isOpen}
          className={`virella-overlay ${social ? "virella-overlay--social" : ""}`}
        >
          <div className="virella-overlay-inner">
            <div className="virella-overlay-heading">
              <span className="virella-overlay-heading-label" aria-hidden="true">Valikko</span>
              <BrandLogo />
              <button
                ref={closeRef}
                type="button"
                onClick={() => dismiss(true)}
                className="inline-flex min-h-11 items-center gap-3 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-mist focus-visible:outline-offset-4"
                aria-label="Sulje valikko"
              >
                <span className="hidden sm:inline">Sulje</span>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <path d="M5 5 19 19M19 5 5 19" />
                </svg>
              </button>
            </div>

            <div className="virella-overlay-body">
              <div className="virella-overlay-main">
                <p className="virella-overlay-overline">Siirry sivulle</p>
                <nav aria-label="Päänavigaatio">
                  <ol className="virella-overlay-list">
                    {items.map((item, index) => (
                      <li key={item.href} style={{ "--index": index } as React.CSSProperties}>
                        <Link
                          href={item.href}
                          onClick={() => dismiss(false)}
                          className="virella-overlay-link"
                        >
                          <span className="virella-overlay-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                          <span>{item.label}</span>
                          <span className="virella-overlay-link-arrow" aria-hidden="true">↗</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
              <div className="virella-overlay-aside">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Seuraava askel</p>
                <p className="mt-3 max-w-[18rem] text-base leading-7 text-foreground">
                  {social ? "Instagram + Facebook tai LinkedIn. Tutustu palveluihin." : "Maksuton kartoitus. Kolme korjausehdotusta 2 arkipäivässä."}
                </p>
                <Link
                  href={cta.href}
                  onClick={() => dismiss(false)}
                  className={`mt-6 inline-flex min-h-12 items-center justify-center rounded-lg px-5 py-3 text-center text-sm font-bold transition-colors duration-200 focus-visible:outline-offset-4 ${social ? "bg-cyan-400 text-zinc-950 hover:bg-cyan-300" : "bg-action text-white hover:bg-[#ac381d]"}`}
                >
                  {cta.label}
                </Link>
              </div>
            </div>
            <div className="virella-overlay-bottom">
              <span>Digitaalista näkyvyyttä paikallisille yrityksille</span>
              <span>Helsinki · Suomi</span>
            </div>
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
