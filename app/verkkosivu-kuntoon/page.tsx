import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/marketing/service-landing-page";

export const metadata: Metadata = {
  title: "Conversion Fix — verkkosivun tärkeät korjaukset 690 €",
  description: "Korjaa nykyisen verkkosivusi tärkeimmät yhteydenottoa vaikeuttavat kohdat ilman täyttä verkkosivuprojektia. Conversion Fix 690 € kertamaksulla, toimitus 72 h lähtötietojen valmistuttua.",
  alternates: {
    canonical: "/verkkosivu-kuntoon",
  },
};

export default function WebsiteFixPage() {
  return <ServiceLandingPage productKey="websiteFix" />;
}
