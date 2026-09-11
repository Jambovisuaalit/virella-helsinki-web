import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/marketing/service-landing-page";

export const metadata: Metadata = {
  title: "Instagram-markkinointi yrityksille",
  description: "Instagram-markkinointi valmiina palveluna suomalaisille yrittäjille ja pk-yrityksille.",
  alternates: {
    canonical: "/instagram",
  },
};

export default function InstagramPage() {
  return <ServiceLandingPage productKey="instagram" />;
}
