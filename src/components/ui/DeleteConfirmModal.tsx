// src/components/ui/DeleteConfirmModal.tsx

import { Button } from '../../components/ui';

interface DeleteConfirmModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ title, description, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6 text-gray-700">{description}</p>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onCancel}>
            انصراف
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            تایید
          </Button>
        </div>
      </div>
    </div>
  );
}
