import React from 'react';
import { DialogTitle, DialogContent, DialogFooter,Dialog } from './Dialog';
import Button from './Button';

interface DeleteConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ open, onConfirm, onCancel }) => (
  <Dialog open={open} onOpenChange={onCancel}>
    <DialogTitle>حذف سرنخ</DialogTitle>
    <DialogContent>آیا مطمئن هستید که می‌خواهید این سرنخ را حذف کنید؟</DialogContent>
    <DialogFooter>
      <Button variant="secondary" onClick={onCancel}>انصراف</Button>
      <Button variant="destructive" onClick={onConfirm}>حذف</Button>
    </DialogFooter>
  </Dialog>
);

export default DeleteConfirmModal;
