import { Lead } from './lead';

export interface LeadWithProduct extends Lead {
  product_name?: string;
  product_quantity?: number;
}
