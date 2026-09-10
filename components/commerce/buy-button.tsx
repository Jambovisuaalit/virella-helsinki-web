type BuyButtonProps = {
  productId: string;
  label?: string;
  className?: string;
};

export function BuyButton({ productId, label = "Osta nyt", className = "" }: BuyButtonProps) {
  return (
    <form action="/api/checkout" method="post" className={className}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-action px-5 py-3 text-sm font-bold text-white transition hover:brightness-90 sm:w-auto">
        {label}
      </button>
    </form>
  );
}
