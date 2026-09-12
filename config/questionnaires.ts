import { products, type ProductId } from "@/config/products";

export type QuestionnaireField = {
  name: string;
  label: string;
  type: "text" | "url" | "textarea";
  required?: boolean;
  placeholder?: string;
};

export type QuestionnaireDefinition = {
  id: string;
  productKey: ProductId;
  productId: string;
  title: string;
  description: string;
  fields: readonly QuestionnaireField[];
};

export const questionnaires = {
  websiteFix: {
    id: "verkkosivu-kuntoon-alkukysely",
    productKey: "websiteFix",
    productId: products.websiteFix.id,
    title: "Conversion Fix -aloituskysely",
    description: "Anna tarvittavat lähtötiedot nykyisestä sivustosta, tärkeimmästä yhteydenottotavoitteesta ja näkyvimmästä ongelmasta. Älä lähetä salasanoja lomakkeella.",
    fields: [
      { name: "companyName", label: "Yrityksen nimi", type: "text", required: true },
      { name: "website", label: "Nykyinen verkkosivusto", type: "url", required: true, placeholder: "https://" },
      { name: "goal", label: "Mikä on sivuston tärkein tavoite?", type: "textarea", required: true, placeholder: "Esim. tarjouspyyntö, ajanvaraus tai puhelu" },
      { name: "platform", label: "Millä alustalla sivusto on tehty?", type: "text", placeholder: "Esim. WordPress, Wix, Webflow tai muu" },
      { name: "contactPath", label: "Miten yhteydenotot tulevat nyt?", type: "textarea", placeholder: "Esim. lomake sähköpostiin, puhelu tai WhatsApp" },
      { name: "access", label: "Miten tarvittavat käyttöoikeudet voidaan antaa?", type: "textarea", placeholder: "Kuvaa tapa. Älä kirjoita salasanoja tähän." },
      { name: "averageCustomerValue", label: "Mikä on tyypillisen uuden asiakkaan tai kaupan arvo?", type: "text", placeholder: "Arvio riittää" },
      { name: "priority", label: "Mikä sivustossa häiritsee eniten juuri nyt?", type: "textarea" },
    ],
  },
  instagram: {
    id: "instagram-alkukysely",
    productKey: "instagram",
    productId: products.instagram.id,
    title: "Instagram-palvelun aloituskysely",
    description: "Kerro yrityksestäsi, asiakkaistasi ja nykyisestä Instagram-tekemisestä. Vastaukset toimivat sisältösuunnittelun lähtötietoina.",
    fields: [
      { name: "companyName", label: "Yrityksen nimi", type: "text", required: true },
      { name: "website", label: "Verkkosivusto", type: "url", placeholder: "https://" },
      { name: "instagramUrl", label: "Instagram-profiili", type: "url", placeholder: "https://instagram.com/..." },
      { name: "customers", label: "Ketkä ovat tärkeimmät asiakkaanne?", type: "textarea", required: true },
      { name: "services", label: "Mitä palveluita haluatte nostaa esiin?", type: "textarea", required: true },
      { name: "materials", label: "Millaista kuva- tai videomateriaalia teillä on käytettävissä?", type: "textarea" },
    ],
  },
  linkedin: {
    id: "linkedin-alkukysely",
    productKey: "linkedin",
    productId: products.linkedin.id,
    title: "LinkedIn-palvelun aloituskysely",
    description: "Kerro asiantuntemuksesta, kohderyhmästä ja aiheista, joista haluatte tulla tunnetuksi LinkedInissä.",
    fields: [
      { name: "companyName", label: "Yrityksen nimi", type: "text", required: true },
      { name: "website", label: "Verkkosivusto", type: "url", placeholder: "https://" },
      { name: "linkedinUrl", label: "LinkedIn-profiili tai yrityssivu", type: "url", placeholder: "https://linkedin.com/..." },
      { name: "expertise", label: "Mistä asiantuntemuksesta haluatte tulla tunnetuksi?", type: "textarea", required: true },
      { name: "customers", label: "Kenet haluatte tavoittaa?", type: "textarea", required: true },
      { name: "topics", label: "Mitkä aiheet ovat liiketoiminnalle tärkeimpiä?", type: "textarea" },
    ],
  },
  landingPageSeo: {
    id: "landing-page-seo-alkukysely",
    productKey: "landingPageSeo",
    productId: products.landingPageSeo.id,
    title: "Landing Page + SEO -aloituskysely",
    description: "Kerro palvelusta, kohderyhmästä ja sivun tavoitteesta. Vastaukset ohjaavat sivurakennetta, copya ja hakukoneoptimointia.",
    fields: [
      { name: "companyName", label: "Yrityksen nimi", type: "text", required: true },
      { name: "website", label: "Nykyinen verkkosivusto", type: "url", placeholder: "https://" },
      { name: "service", label: "Mitä palvelua landing page myy?", type: "textarea", required: true },
      { name: "customers", label: "Kenelle palvelu on tarkoitettu?", type: "textarea", required: true },
      { name: "goal", label: "Mikä on sivun tärkein tavoite tai toimintakehotus?", type: "textarea", required: true },
      { name: "competitors", label: "Onko kilpailijoita tai esimerkkisivuja, jotka kannattaa huomioida?", type: "textarea" },
    ],
  },
} satisfies Record<ProductId, QuestionnaireDefinition>;

export function getQuestionnaireByProductId(productId: string) {
  return Object.values(questionnaires).find((questionnaire) => questionnaire.productId === productId);
}
