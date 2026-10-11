import type { SVGProps } from "react";

export type SocialNetwork = "instagram" | "facebook" | "linkedin" | "google" | "youtube";

type Props = SVGProps<SVGSVGElement> & {
  network: SocialNetwork;
};

export function SocialIcon({ network, ...props }: Props) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
    focusable: "false" as const,
    ...props,
  };

  switch (network) {
    case "instagram":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.2" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.8" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.4 21v-7.9h2.65l.4-3.12H14.4V8c0-.9.27-1.5 1.55-1.5h1.66V3.72a22 22 0 0 0-2.42-.12c-2.4 0-4.04 1.47-4.04 4.17v2.22H8.45v3.12h2.7V21h3.25Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor" viewBox="0 0 24 24">
          <path d="M5.26 3.75a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM3.6 9.2h3.31V20.4H3.6V9.2ZM9.15 9.2h3.18v1.53h.05c.44-.83 1.52-1.7 3.14-1.7 3.35 0 3.98 2.2 3.98 5.06v6.31h-3.31v-5.6c0-1.34-.02-3.07-1.87-3.07-1.88 0-2.17 1.46-2.17 2.98v5.69H9.15V9.2Z" />
        </svg>
      );
    case "google":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20.8 12.3c0 5.23-3.47 8.5-8.55 8.5a8.8 8.8 0 1 1 5.95-15.29l-2.3 2.24A5.5 5.5 0 1 0 17.4 14H12v-3.05h8.66c.1.45.14.91.14 1.35Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.3" y="5.25" width="19.4" height="13.5" rx="4.7" />
          <path d="m10.2 9 5.1 3-5.1 3V9Z" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
