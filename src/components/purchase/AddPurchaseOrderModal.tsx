// src/components/purchase/AddPurchaseOrderModal.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { useAppDispatch } from '../../store/hooks';
import { createPurchaseOrder } from '../../features/purchase/purchaseSlice';
import { toast } from 'react-hot-toast';

const addOrderSchema = z.object({
  product: z.string().min(1, 'نام محصول الزامی است'),
  quantity: z.number().min(1, 'تعداد باید بیشتر از ۰ باشد'),
  status: z.string().min(1, 'وضعیت را انتخاب کنید'),
});

type AddOrderFormValues = z.infer<typeof addOrderSchema>;

interface AddPurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPurchaseOrderModal({ isOpen, onClose }: AddPurchaseOrderModalProps) {
  const dispatch = useAppDispatch();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AddOrderFormValues>({
    resolver: zodResolver(addOrderSchema),
  });

  const onSubmit = async (data: AddOrderFormValues) => {
    try {
      await dispatch(createPurchaseOrder(data)).unwrap();
      toast.success('سفارش جدید با موفقیت ثبت شد!');
      reset();
      onClose();
    } catch (error) {
      toast.error('خطا در ثبت سفارش!');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-6">ثبت سفارش جدید</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="نام محصول"
          {...register('product')}
          error={errors.product?.message}
        />

        <Input
          label="تعداد"
          type="number"
          {...register('quantity', { valueAsNumber: true })}
          error={errors.quantity?.message}
        />

        <Select
          label="وضعیت"
          {...register('status')}
          error={errors.status?.message}
          options={[
            { label: 'در انتظار', value: 'در انتظار' },
            { label: 'تایید شده', value: 'تایید شده' },
            { label: 'تحویل داده شده', value: 'تحویل داده شده' },
          ]}
        />

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>
            ثبت سفارش
          </Button>
        </div>
      </form>
    </Modal>
  );
}
