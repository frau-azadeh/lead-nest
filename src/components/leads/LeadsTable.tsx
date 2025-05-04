// LeadsTable.tsx
import { Lead } from '../../types/lead';
import StatusBadge from './StatusBadge';
import LeadStatusChanger from './LeadStatusChanger';
import { Button } from '../ui';
import { Edit, Trash2 } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void; // اینجا فقط callback ساده می‌فرستیم
}

export default function LeadsTable({ leads, onEdit, onDelete }: LeadsTableProps) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>نام کامل</th>
          <th>ایمیل</th>
          <th>شماره تماس</th>
          <th>شرکت</th>
          <th>وضعیت</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {leads.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center p-4">هیچ داده‌ای یافت نشد.</td>
          </tr>
        ) : leads.map((lead) => (
          <tr key={lead.id}>
            <td>{lead.full_name}</td>
            <td>{lead.email}</td>
            <td>{lead.phone_number}</td>
            <td>{lead.company}</td>
            <td>
              <div className="flex items-center gap-2">
                <StatusBadge status={lead.status} />
                <LeadStatusChanger lead={lead} />
              </div>
            </td>
            <td className="flex gap-2">
              <Button onClick={() => onEdit(lead)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="destructive" onClick={() => onDelete(lead)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
