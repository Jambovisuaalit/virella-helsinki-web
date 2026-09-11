import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/marketing/service-landing-page";

export const metadata: Metadata = {
  title: "Landing Page + SEO yrityksille",
  description: "Responsiivinen landing page, on-page SEO, suorituskyvyn optimointi ja analytiikan integrointi yhtenä toimituksena.",
  alternates: {
    canonical: "/landing-page-seo",
  },
};

export default function LandingPageSeoPage() {
  return <ServiceLandingPage productKey="landingPageSeo" />;
}
