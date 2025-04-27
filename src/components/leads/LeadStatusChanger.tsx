// src/components/leads/LeadStatusChanger.tsx

import { useState } from 'react';
import { Lead } from '../../types/lead';
import { useAppDispatch } from '../../store/hooks';
import { updateLead } from '../../features/leads/leadsSlice';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface LeadStatusChangerProps {
  lead: Lead;
}

const statusOptions = [
  { value: 'new', label: 'جدید' },
  { value: 'contacted', label: 'تماس گرفته شده' },
  { value: 'qualified', label: 'مشتری بالقوه' },
  { value: 'lost', label: 'از دست رفته' },
];

export default function LeadStatusChanger({ lead }: LeadStatusChangerProps) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await dispatch(updateLead({ ...lead, status: newStatus })).unwrap();
      toast.success('وضعیت با موفقیت تغییر کرد!');
    } catch (error) {
      toast.error('خطا در تغییر وضعیت');
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* دکمه تغییر وضعیت */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-all"
      >
        تغییر وضعیت
      </button>

      {/* لیست وضعیت‌ها */}
      {isOpen && (
        <div className="absolute z-10 right-0 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-gray-200">
          <ul className="py-1">
            {statusOptions.map((status) => (
              <li
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={cn(
                  'px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100',
                  lead.status === status.value && 'bg-blue-50 font-semibold'
                )}
              >
                {status.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
