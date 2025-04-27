// src/components/leads/LeadsTable.tsx

import { Lead } from '../../types/lead';
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Button } from '../../components/ui';
import { cn } from '../../utils/cn';
import { toast } from 'react-hot-toast';
import LeadStatusChanger from './LeadStatusChanger';


interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export default function LeadsTable({ leads, onEdit, onDelete }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        هیچ سرنخی ثبت نشده است.
      </div>
    );
  }

  const handleDeleteClick = (lead: Lead) => {
    toast((t) => (
      <span className="flex flex-col gap-2">
        <span>آیا از حذف این سرنخ مطمئن هستید؟</span>
        <div className="flex justify-end gap-4 mt-2">
          <button
            onClick={() => {
              onDelete(lead);
              toast.dismiss(t.id);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            بله، حذف کن
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            انصراف
          </button>
        </div>
      </span>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700">نام کامل</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700">ایمیل</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700">شماره تماس</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700">شرکت</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700">وضعیت</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr
              key={lead.id}
              className={cn(
                'border-b hover:bg-gray-50 transition-all',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              )}
            >
              <td className="px-6 py-4 whitespace-nowrap">{lead.full_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{lead.phone_number || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{lead.company || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap flex gap-2 justify-end">
              <LeadStatusChanger lead={lead} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(lead)}
                  className="border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(lead)}
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
