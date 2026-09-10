export type BillingModel = "month" | "one_time";

export type Product = {
  id: string;
  name: string;
  price: number;
  billing: BillingModel;
  commitmentMonths?: number;
  totalPrice?: number;
  features: readonly string[];
};
