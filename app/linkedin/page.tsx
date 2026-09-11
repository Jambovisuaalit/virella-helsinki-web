import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/marketing/service-landing-page";

export const metadata: Metadata = {
  title: "LinkedIn-markkinointi yrityksille",
  description: "LinkedIn-sisältö ja profiilin kehitys valmiina palveluna suomalaisille B2B-yrityksille ja asiantuntijoille.",
  alternates: {
    canonical: "/linkedin",
  },
};

export default function LinkedInPage() {
  return <ServiceLandingPage productKey="linkedin" />;
}
