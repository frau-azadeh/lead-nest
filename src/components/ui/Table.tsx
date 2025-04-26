// src/components/ui/Table.tsx

import { Edit, Trash2 } from 'lucide-react';
import { Lead } from '../../types/lead';
import { useState } from 'react';
import DeleteConfirmModal from '../../components/ui/DeleteConfirmModal';

interface TableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export default function Table({ leads, onEdit, onDelete }: TableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setOpenDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedLead) {
      onDelete(selectedLead);
      setSelectedLead(null);
    }
    setOpenDeleteModal(false);
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-start">نام کامل</th>
            <th className="px-4 py-2 text-start">ایمیل</th>
            <th className="px-4 py-2 text-start">شماره تماس</th>
            <th className="px-4 py-2 text-start">شرکت</th>
            <th className="px-4 py-2 text-start">وضعیت</th>
            <th className="px-4 py-2 text-center">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{lead.full_name}</td>
              <td className="px-4 py-2">{lead.email}</td>
              <td className="px-4 py-2">{lead.phone_number}</td>
              <td className="px-4 py-2">{lead.company}</td>
              <td className="px-4 py-2">{lead.status}</td>
              <td className="px-4 py-2 text-center flex items-center justify-center space-x-2">
                <Edit
                  size={20}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => onEdit(lead)}
                />
                <Trash2
                  size={20}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                  onClick={() => handleDelete(lead)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* مدال تایید حذف */}
      {openDeleteModal && selectedLead && (
        <DeleteConfirmModal
          title="حذف سرنخ"
          description={`آیا مطمئن هستید که می‌خواهید "${selectedLead.full_name}" را حذف کنید؟`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setOpenDeleteModal(false);
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
}
