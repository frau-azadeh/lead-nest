import { Edit, Trash2 } from 'lucide-react';
import { Lead } from '../../types/lead';
import { Button } from '../../components/ui';

interface TableProps<T extends Lead> {
  leads: T[] | undefined;
  onEdit: (lead: T) => void;
  onDelete: (lead: T) => void;
  renderStatus?: (lead: T) => React.ReactNode;
}

export default function Table<T extends Lead>({
  leads,
  onEdit,
  onDelete,
  renderStatus,
}: TableProps<T>) {
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
          {leads && leads.length > 0 ? (
            leads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{lead.full_name}</td>
                <td className="px-4 py-2">{lead.email}</td>
                <td className="px-4 py-2">{lead.phone_number}</td>
                <td className="px-4 py-2">{lead.company}</td>
                <td className="px-4 py-2">
                  {renderStatus ? renderStatus(lead) : lead.status}
                </td>
                <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-500 hover:bg-blue-50"
                    onClick={() => onEdit(lead)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(lead)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                هیچ داده‌ای یافت نشد.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
