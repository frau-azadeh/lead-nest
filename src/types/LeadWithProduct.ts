import { Lead } from './lead';

export interface LeadWithProduct extends Lead {
  product_name?: string | null;
  product_quantity?: number | null;
}
