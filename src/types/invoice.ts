export interface Invoice {
  id: string;
  lead_id: string;
  type: string;
  amount: number;
  product_name?: string; // 👈 این خط رو اضافه کن
  created_at: string;
}

// types/invoice.ts
export interface InsertInvoice {
  lead_id: string;
  type: string;
  amount: number;
  product_name?: string;
}
