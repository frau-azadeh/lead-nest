// src/components/leads/LeadStatusChanger.tsx

import { useState, useRef, useEffect } from 'react';
import { LeadWithProduct } from '../../types/LeadWithProduct';
import { useAppDispatch } from '../../store/hooks';
import { updateLeadStatus } from '../../features/leads/leadsSlice';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface LeadStatusChangerProps {
  lead: LeadWithProduct;
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await dispatch(updateLeadStatus({ id: lead.id, status: newStatus })).unwrap();
      toast.success('وضعیت بروزرسانی شد!');
    } catch {
      toast.error('خطا در تغییر وضعیت');
    } finally {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition"
      >
        تغییر وضعیت
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 right-0">
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
