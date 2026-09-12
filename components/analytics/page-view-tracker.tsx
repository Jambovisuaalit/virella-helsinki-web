"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics/client";

const excludedPrefixes = ["/admin", "/checkout", "/alkukysely", "/api"];

export function PageViewTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled || !pathname) return;
    if (excludedPrefixes.some((prefix) => pathname.startsWith(prefix))) return;

    const track = () => trackAnalyticsEvent("page_view");
    track();
    window.addEventListener("virella:analytics-consent", track);
    return () => window.removeEventListener("virella:analytics-consent", track);
  }, [enabled, pathname]);

  return null;
}
