// types/Sale.ts
export interface Sale {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  status: string;
  createdAt: string;
  productName?: string;
  productQuantity?: number;
}
