import { useEffect, useRef, useState } from 'react';
import { Lead } from '../../types/lead';
import { useAppDispatch } from '../../store/hooks';
import { updateLead } from '../../features/leads/leadsSlice';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';
import { createPortal } from 'react-dom';

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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleStatusChange = async (newStatus: string) => {
    try {
      await dispatch(updateLead({ ...lead, status: newStatus })).unwrap();
      toast.success('وضعیت با موفقیت تغییر کرد!');
    } catch {
      toast.error('خطا در تغییر وضعیت');
    } finally {
      setIsOpen(false);
    }
  };

  // محاسبه موقعیت دقیق dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX + rect.width / 2 - 80, // center align
      });
    }
  }, [isOpen]);

  // بستن dropdown با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!buttonRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-all"
      >
        تغییر وضعیت
      </button>

      {isOpen &&
        createPortal(
          <div
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              zIndex: 9999,
              width: 160,
            }}
            className="bg-white rounded-lg shadow-lg ring-1 ring-gray-200"
          >
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
          </div>,
          document.body
        )}
    </>
  );
}
