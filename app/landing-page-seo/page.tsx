import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/marketing/service-landing-page";

export const metadata: Metadata = {
  title: "Landing Page + SEO yrityksille",
  description: "Yksi suomenkielinen myyntisivu, myynticopy, yhteydenottolomake ja SEO-perusteet. 990 € kertamaksu.",
  alternates: {
    canonical: "/landing-page-seo",
  },
};

export default function LandingPageSeoPage() {
  return <ServiceLandingPage productKey="landingPageSeo" />;
}
