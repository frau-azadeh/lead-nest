// schemas/leadSchema.ts
import { z } from 'zod';

export const leadSchema = z.object({
  full_name: z.string().min(1, 'نام کامل الزامی است'),
  email: z.string().email('ایمیل معتبر وارد کنید'),
  phone_number: z.string().optional(),
  company: z.string().optional(),
  status: z.string().min(1, 'وضعیت الزامی است'),
});
