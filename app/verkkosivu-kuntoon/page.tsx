import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/marketing/service-landing-page";

export const metadata: Metadata = {
  title: "Verkkosivun korjaukset – pyydä tarjous | Conversion Fix",
  description: "Selvitetään verkkosivusi tärkeimmät parannuskohdat. Saat kirjallisen tarjouksen, jossa sovitaan korjaukset, hinta ja aikataulu ennen työn aloitusta.",
  alternates: {
    canonical: "/verkkosivu-kuntoon",
  },
};

export default function WebsiteFixPage() {
  return <ServiceLandingPage productKey="websiteFix" />;
}
