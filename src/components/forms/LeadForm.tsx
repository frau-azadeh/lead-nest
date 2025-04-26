// src/components/forms/LeadForm.tsx

import { useState, useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createLead, updateLead, clearEditingLead } from '../../features/leads/leadsSlice';
import { Button, Input, Modal } from '../../components/ui';
import { toast } from 'react-hot-toast';

// اسکیمای فرم
const leadSchema = z.object({
  full_name: z.string().min(3, 'Full Name is required'),
  email: z.string().email('Invalid Email'),
  phone_number: z.string().optional(),
  company: z.string().optional(),
  status: z.string().default('new'),
});

type LeadFormData = z.infer<typeof leadSchema>;

export default function LeadForm() {
  const dispatch = useAppDispatch();
  const { editingLead } = useAppSelector((state) => state.leads);
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema) as unknown as Resolver<LeadFormData>,
  });

  useEffect(() => {
    if (editingLead) {
      setIsOpen(true);
      setValue('full_name', editingLead.full_name);
      setValue('email', editingLead.email);
      setValue('phone_number', editingLead.phone_number ?? '');
      setValue('company', editingLead.company ?? '');
      setValue('status', editingLead.status);
    }
  }, [editingLead, setValue]);

  const onSubmit = async (data: LeadFormData) => {
    try {
      if (editingLead) {
        await dispatch(updateLead({ ...editingLead, ...data })).unwrap();
        toast.success('Lead updated successfully!');
      } else {
        await dispatch(createLead(data)).unwrap();
        toast.success('Lead added successfully!');
      }
      reset();
      setIsOpen(false);
      dispatch(clearEditingLead());
    } catch (error) {
      toast.error('An error occurred!');
    }
  };

  const handleAddNewLead = () => {
    reset();
    dispatch(clearEditingLead());
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
    dispatch(clearEditingLead());
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={handleAddNewLead}>➕ Add Lead</Button>
      </div>

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-bold mb-6">
          {editingLead ? 'Edit Lead' : 'Add New Lead'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" {...register('full_name')} error={errors.full_name?.message} />
          <Input label="Email" {...register('email')} error={errors.email?.message} />
          <Input label="Phone Number" {...register('phone_number')} error={errors.phone_number?.message} />
          <Input label="Company" {...register('company')} error={errors.company?.message} />

          <div className="flex justify-end">
            <Button type="submit" isLoading={isSubmitting}>
              {editingLead ? 'Update Lead' : 'Save Lead'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
