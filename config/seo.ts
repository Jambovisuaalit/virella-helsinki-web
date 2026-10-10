import { brandConfig } from "@/config/brand";
import { products } from "@/config/products";

export const seoConfig = {
  siteName: brandConfig.name,
  siteUrl: "https://virellahelsinki.com",
  defaultTitle: "Markkinointi valmiina palveluna | Virella Helsinki",
  titleTemplate: `%s | ${brandConfig.name}`,
  defaultDescription: `Instagram-, Facebook- ja LinkedIn-markkinointi valmiina palveluna. Virella Helsinki hoitaa suunnittelun, sisällöt ja julkaisun. ${products.instagram.price} €/kk, ${products.instagram.commitmentMonths} kk minimi.`,
} as const;
