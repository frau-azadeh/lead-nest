export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  company: string;
  status: string;
  product_name?: string | null;
  product_quantity?: number | null;
  created_at: string;
}

// ✅ type دقیق برای insert
export interface InsertLead {
  full_name: string;
  email: string;
  phone_number: string;
  company: string;
  status: string;
  product_name?: string | null;
  product_quantity?: number | null;
}
