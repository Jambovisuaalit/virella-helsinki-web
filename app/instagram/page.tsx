import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/marketing/service-landing-page";

export const metadata: Metadata = {
  title: "Instagram + Facebook -sisällöntuotanto yrityksille",
  description: "12 alkuperäistä sisältöä kuukaudessa, jokainen Instagramiin ja Facebookiin. 490 €/kk, 3 kuukauden aloitusjakso ja hyväksyntä ennen julkaisua.",
  alternates: {
    canonical: "/instagram",
  },
};

export default function InstagramPage() {
  return <ServiceLandingPage productKey="instagram" />;
}
