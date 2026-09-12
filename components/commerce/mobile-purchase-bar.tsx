import { BuyButton } from "@/components/commerce/buy-button";
import { products, type ProductId } from "@/config/products";

const euro = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function shortLabel(productKey: ProductId) {
  if (productKey === "websiteFix") return "Conversion Fix";
  if (productKey === "landingPageSeo") return "Landing + SEO";
  return productKey === "instagram" ? "Instagram" : "LinkedIn";
}

export function MobilePurchaseBar({ currentProduct }: { currentProduct: ProductId }) {
  const product = products[currentProduct];

  return (
    <aside aria-label="Palvelun ostopalkki" className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto max-w-md rounded-[1.35rem] border border-border/80 bg-background/92 p-2 shadow-[0_22px_70px_-28px_rgba(23,33,38,0.5)] backdrop-blur-xl">
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[1rem] bg-surface px-3 py-2.5">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <p className="truncate text-xs font-extrabold text-foreground">{shortLabel(currentProduct)}</p>
              <p className="shrink-0 text-xs font-extrabold text-brand">
                {euro.format(product.price)}{product.billing === "month" ? "/kk" : ""}
              </p>
            </div>
            <p className="mt-0.5 text-[11px] leading-4 text-muted">
              {product.billing === "month" ? `${product.commitmentMonths} kk · yht. ${euro.format(product.totalPrice)}` : "kertamaksu"}
            </p>
          </div>
          <BuyButton
            productId={product.id}
            label="Osta"
            source="mobile_purchase_bar"
            buttonClassName="min-h-10 rounded-full bg-action px-4 text-xs font-extrabold text-white shadow-[0_8px_22px_-12px_rgba(216,74,36,0.75)] transition active:scale-[0.98]"
          />
        </div>
      </div>
    </aside>
  );
}
