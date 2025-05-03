import { Lead } from '../../types/lead';
import { Button } from '../../components/ui';
import { Edit, Trash2 } from 'lucide-react';

interface TableProps<T extends Lead> {
  leads: T[];
  onEdit: (lead: T) => void;
  onDelete: (lead: T) => void;
  renderStatus?: (lead: T) => React.ReactNode;
}

export default function Table<T extends Lead>({
  leads = [], // ✅ مقدار پیش‌فرض
  onEdit,
  onDelete,
  renderStatus,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      {leads.length === 0 ? (
        <p className="text-center text-gray-500 py-4">هیچ داده‌ای یافت نشد.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-700">
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
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.full_name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone_number}</td>
                <td>{lead.company}</td>
                <td>{renderStatus ? renderStatus(lead) : lead.status}</td>
                <td>
                  <Button onClick={() => onEdit(lead)}>
                    <Edit size={16} />
                  </Button>
                  <Button onClick={() => onDelete(lead)}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
