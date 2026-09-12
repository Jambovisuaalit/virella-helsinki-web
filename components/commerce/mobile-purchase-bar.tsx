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
    <aside aria-label="Palvelun ostopalkki" className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_-20px_rgba(31,36,46,0.28)] backdrop-blur-md md:hidden">
      <div className="mx-auto max-w-md">
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-brand/25 bg-surface px-3 py-2.5 shadow-sm">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <p className="truncate text-xs font-bold text-foreground">{shortLabel(currentProduct)}</p>
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
            buttonClassName="min-h-10 rounded-lg bg-action px-4 text-xs font-bold text-white"
          />
        </div>
      </div>
    </aside>
  );
}
