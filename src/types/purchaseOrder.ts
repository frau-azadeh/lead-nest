export interface PurchaseOrder {
  id: string;
  product: string;
  quantity: number;
  status: 'در انتظار' | 'تایید شده' | 'تحویل داده شده';
  created_at: string;
}
