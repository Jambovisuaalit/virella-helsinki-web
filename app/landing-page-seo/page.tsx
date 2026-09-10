import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/marketing/service-landing-page";

export const metadata: Metadata = {
  title: "Landing Page + SEO yrityksille | Virella Helsinki",
  description: "Responsiivinen landing page, on-page SEO, suorituskyvyn optimointi ja analytiikan integrointi yhtenä toimituksena.",
};

export default function LandingPageSeoPage() {
  return <ServiceLandingPage productKey="landingPageSeo" />;
}
