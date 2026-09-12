import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/marketing/service-landing-page";

export const metadata: Metadata = {
  title: "Conversion Fix — 690 €",
  description: "Conversion Fix korjaa nykyisen verkkosivun tärkeimmät myyntiä estävät kohdat kiinteällä 690 € kertamaksulla.",
  alternates: {
    canonical: "/verkkosivu-kuntoon",
  },
};

export default function WebsiteFixPage() {
  return <ServiceLandingPage productKey="websiteFix" />;
}
