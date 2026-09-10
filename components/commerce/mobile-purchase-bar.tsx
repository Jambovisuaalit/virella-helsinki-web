import { products, type ProductId } from "@/config/products";

const euro = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const standardProductOrder: ProductId[] = ["instagram", "linkedin", "landingPageSeo"];

function shortLabel(productKey: ProductId) {
  if (productKey === "websiteFix") return "Verkkosivu kuntoon";
  if (productKey === "landingPageSeo") return "Landing + SEO";
  return productKey === "instagram" ? "Instagram" : "LinkedIn";
}

export function MobilePurchaseBar({ currentProduct }: { currentProduct: ProductId }) {
  const productOrder: ProductId[] = currentProduct === "websiteFix" ? ["websiteFix"] : standardProductOrder;

  return (
    <aside aria-label="Palveluiden ostopalkki" className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_-20px_rgba(31,36,46,0.28)] backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-md gap-1.5">
        {productOrder.map((productKey) => {
          const product = products[productKey];
          const active = productKey === currentProduct;
          return (
            <div key={product.id} className={`grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border px-3 py-2 ${active ? "border-brand/35 bg-brand/5" : "border-border bg-surface"}`}>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="truncate text-xs font-bold text-foreground">{shortLabel(productKey)}</p>
                  <p className="shrink-0 text-xs font-extrabold text-brand">
                    {euro.format(product.price)}{product.billing === "month" ? "/kk" : ""}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] leading-4 text-muted">
                  {product.billing === "month" ? `${product.commitmentMonths} kk · yht. ${euro.format(product.totalPrice)}` : "kertamaksu"}
                </p>
              </div>
              <form action="/api/checkout" method="post">
                <input type="hidden" name="productId" value={product.id} />
                <button type="submit" className="min-h-10 rounded-lg bg-action px-3 text-xs font-bold text-white">
                  Osta
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
