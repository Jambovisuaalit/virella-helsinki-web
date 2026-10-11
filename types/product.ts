export type BillingModel = "month" | "one_time" | "quote";

export type Product = {
  id: string;
  name: string;
  price: number | null;
  billing: BillingModel;
  commitmentMonths?: number;
  totalPrice?: number;
  deposit?: number;
  finalPayment?: number;
  features: readonly string[];
};
