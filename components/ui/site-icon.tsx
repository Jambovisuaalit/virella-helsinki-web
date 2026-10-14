import type { SVGProps } from "react";

type IconName = "arrow-right" | "arrow-up-right" | "check" | "external-link";

type Props = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

export function SiteIcon({ name, size = 18, ...props }: Props) {
  const paths: Record<IconName, React.ReactNode> = {
    "arrow-right": <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    "arrow-up-right": <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
    "check": <path d="m5 12 4 4L19 6" />,
    "external-link": <><path d="M13 5h6v6" /><path d="M19 5 10 14" /><path d="M19 13v6H5V5h6" /></>,
  };
  return (
    <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {paths[name]}
    </svg>
  );
}
