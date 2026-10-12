import { PriceDisplay } from "@/components/ui/price-display";
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
  const isQuote = product.billing === "quote";

  return (
    <aside aria-label="Palvelun aloituspalkki" className="virella-mobile-bar md:hidden">
      <div className="virella-mobile-bar-panel ui-card">
        <div className="virella-mobile-bar-content">
          <div className="min-w-0">
            <div className="flex flex-col gap-1">
              <p className="truncate text-xs font-extrabold text-foreground">{shortLabel(currentProduct)}</p>
              <PriceDisplay amount={product.price} size="compact" suffix={product.billing === "month" ? "/kk" : undefined} />
            </div>
            <p className="mt-0.5 text-[11px] leading-4 text-muted">
              {isQuote ? "Hinta ja toimitus sovitaan kirjallisesti" : product.billing === "month" ? `${product.commitmentMonths} kk · yht. ${euro.format(product.totalPrice)}` : "kertamaksu"}
            </p>
          </div>
          <BuyButton
            productId={product.id}
            label="Aloita yhteistyö"
            source="mobile_purchase_bar"
            buttonClassName="ui-button ui-button--primary ui-button--compact"
          />
        </div>
      </div>
    </aside>
  );
}
