// components/forms/LeadForm.tsx
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeadFormData } from '../../types/LeadFormData';
import { leadSchema } from '../../types/leadSchema';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createLead, updateLead, clearEditingLead } from '../../features/leads/leadsSlice';
import { toast } from 'react-hot-toast';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadForm({ isOpen, onClose }: LeadFormProps) {
  const dispatch = useAppDispatch();
  const editingLead = useAppSelector((state) => state.leads.editingLead);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { status: 'new' },
  });

  // پر کردن فرم هنگام ویرایش
  useEffect(() => {
    if (editingLead) {
      setValue('full_name', editingLead.full_name);
      setValue('email', editingLead.email);
      setValue('phone_number', editingLead.phone_number ?? '');
      setValue('company', editingLead.company ?? '');
      setValue('status', editingLead.status ?? 'new');
    } else {
      reset();
    }
  }, [editingLead, setValue, reset]);

  const onSubmit: SubmitHandler<LeadFormData> = async (data) => {
    try {
      if (editingLead) {
        await dispatch(updateLead({ ...editingLead, ...data })).unwrap();
        toast.success('Lead updated!');
      } else {
        await dispatch(createLead(data)).unwrap();
        toast.success('Lead created!');
      }

      onClose();
      dispatch(clearEditingLead());
      reset();
    } catch {
      toast.error('An error occurred');
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label>نام کامل</label>
              <input {...register('full_name')} />
              {errors.full_name && <p>{errors.full_name.message}</p>}
            </div>

            <div>
              <label>ایمیل</label>
              <input {...register('email')} />
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div>
              <label>شماره تماس</label>
              <input {...register('phone_number')} />
              {errors.phone_number && <p>{errors.phone_number.message}</p>}
            </div>

            <div>
              <label>شرکت</label>
              <input {...register('company')} />
              {errors.company && <p>{errors.company.message}</p>}
            </div>

            <div>
              <label>وضعیت</label>
              <input {...register('status')} />
              {errors.status && <p>{errors.status.message}</p>}
            </div>

            <button type="submit">
              {editingLead ? 'Update Lead' : 'Create Lead'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}