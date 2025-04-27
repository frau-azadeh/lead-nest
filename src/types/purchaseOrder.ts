// src/types/purchaseOrder.ts

export interface PurchaseOrder {
    id: string;
    product: string;
    quantity: number;
    price: number;
    status: 'pending' | 'approved' | 'rejected'; // وضعیت سفارش
    created_at: string; // زمان ثبت سفارش
  }
  