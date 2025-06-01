// src/components/ui/EditLeadModal.tsx
import React, { useState, useEffect } from 'react';
import { Lead } from '../../types/lead';
import { Dialog, DialogTitle, DialogContent, DialogFooter } from './Dialog';
import Input from './Input'; // ✅ استفاده از Input خودت
import Button from './Button';

interface EditLeadModalProps {
  open: boolean;
  lead: Lead;
  onSave: (updatedLead: Lead) => void;
  onCancel: () => void;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({ open, lead, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Lead>(lead);

  useEffect(() => {
    if (lead) setFormData(lead);
  }, [lead]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogTitle>ویرایش اطلاعات سرنخ</DialogTitle>
      <DialogContent className="space-y-4">
        <Input
          label="نام کامل"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
        />
        <Input label="ایمیل" name="email" value={formData.email} onChange={handleChange} />
        <Input
          label="شماره تماس"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
        <Input label="شرکت" name="company" value={formData.company} onChange={handleChange} />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="new">جدید</option>
          <option value="qualified">مشتری بالقوه</option>
          <option value="lost">از دست رفته</option>
        </select>
      </DialogContent>
      <DialogFooter>
        <Button variant="secondary" onClick={onCancel}>
          انصراف
        </Button>
        <Button onClick={handleSubmit}>ذخیره</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditLeadModal;
