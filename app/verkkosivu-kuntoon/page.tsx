import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/marketing/service-landing-page";

export const metadata: Metadata = {
  title: "Verkkosivu kuntoon 72 h",
  description: "Nykyisen verkkosivun tärkeimmät myyntiä estävät kohdat kuntoon kiinteällä 690 € kertamaksulla ilman pitkää projektia tai myyntipalaveria.",
  alternates: {
    canonical: "/verkkosivu-kuntoon",
  },
};

export default function WebsiteFixPage() {
  return <ServiceLandingPage productKey="websiteFix" />;
}
