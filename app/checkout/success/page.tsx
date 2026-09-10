import type { Metadata } from "next";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/section-container";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { products } from "@/config/products";
import { getCheckoutSession, getProductKeyById } from "@/lib/stripe/stripe-api";

export const metadata: Metadata = {
  title: "Maksu vahvistettu | Virella Helsinki",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = first(params.session_id);

  let productName = "Virella-palvelu";
  let productId: string | undefined;
  let paid = false;

  if (sessionId) {
    try {
      const session = await getCheckoutSession(sessionId);
      productId = session.metadata?.productId;
      const productKey = productId ? getProductKeyById(productId) : undefined;
      if (productKey) productName = products[productKey].name;
      paid = session.payment_status === "paid";
    } catch (error) {
      console.error("Checkout success lookup failed", error);
    }
  }

  return (
    <>
      <SiteHeader />
      <main>
        <SectionContainer className="py-16 md:py-24">
          <div className="mx-auto max-w-[720px] rounded-[20px] border border-border bg-surface p-6 shadow-[0_8px_40px_-12px_rgba(31,36,46,0.12)] sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Maksu</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              {paid ? "Maksu vastaanotettu." : "Maksun vahvistusta tarkistetaan."}
            </h1>
            <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
              {paid
                ? `${productName} on nyt liitetty tähän tilaukseen. Viimeistele aloitus täyttämällä tuotekohtainen alkukysely.`
                : "Jos maksu valmistui juuri, päivitä sivu hetken kuluttua. Alkukysely avautuu vain maksetulle tilaukselle."}
            </p>

            {paid && sessionId && productId ? (
              <Link href={`/alkukysely?session_id=${encodeURIComponent(sessionId)}`} className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-action px-5 py-3 text-sm font-bold text-white sm:w-auto">
                Täytä alkukysely
              </Link>
            ) : (
              <Link href="/" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold text-brand">
                Takaisin etusivulle
              </Link>
            )}
          </div>
        </SectionContainer>
      </main>
      <SiteFooter />
    </>
  );
}
