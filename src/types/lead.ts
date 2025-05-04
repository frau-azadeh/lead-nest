export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  company?: string;
  status: string;
  product_name?: string;
  product_quantity?: number;
}
