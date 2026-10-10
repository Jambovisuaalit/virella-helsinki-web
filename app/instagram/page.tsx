import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/marketing/service-landing-page";

export const metadata: Metadata = {
  title: "Instagram- ja Facebook-markkinointi yrityksille",
  description: "Instagram + Facebook -paketti yrityksille: 12 sisältöä / 30 päivää molempiin kanaviin. Suunnittelu, tekstit, julkaisu ja raportti valmiina palveluna.",
  alternates: {
    canonical: "/instagram",
  },
};

export default function InstagramPage() {
  return <ServiceLandingPage productKey="instagram" />;
}
