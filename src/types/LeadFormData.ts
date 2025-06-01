// types/LeadFormData.ts
export interface LeadFormData {
  full_name: string;
  email: string;
  phone_number?: string;
  company?: string;
  status: string; // فرض: اجباری
}
