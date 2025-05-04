// SalesTable.tsx
import { Edit, Trash2, FileText, FilePlus2, Truck } from 'lucide-react';
import { Button } from '../../components/ui';
import { LeadWithProduct } from '../../types/LeadWithProduct';
import StatusBadge from '../leads/StatusBadge';
import LeadStatusChanger from '../leads/LeadStatusChanger';

interface SalesTableProps {
  sales: LeadWithProduct[];
  onEdit: (lead: LeadWithProduct) => void;
  onDelete: (lead: LeadWithProduct) => void;
  onAddProduct: (lead: LeadWithProduct) => void;
  onInvoice: (lead: LeadWithProduct) => void;
  onPreInvoice: (lead: LeadWithProduct) => void;
  onDelivery: (lead: LeadWithProduct) => void;
  onChangeStatus: (lead: LeadWithProduct) => void;
}

export default function SalesTable({
  sales,
  onEdit,
  onDelete,
  onAddProduct,
  onInvoice,
  onPreInvoice,
  onDelivery,
}: SalesTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">نام کامل</th>
            <th className="px-4 py-2">ایمیل</th>
            <th className="px-4 py-2">شماره تماس</th>
            <th className="px-4 py-2">شرکت</th>
            <th className="px-4 py-2">وضعیت</th>
            <th className="px-4 py-2">محصول</th>
            <th className="px-4 py-2">فاکتورها</th>
            <th className="px-4 py-2">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((lead) => (
            <tr key={lead.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{lead.full_name}</td>
              <td className="px-4 py-2">{lead.email}</td>
              <td className="px-4 py-2">{lead.phone_number}</td>
              <td className="px-4 py-2">{lead.company}</td>

              {/* وضعیت */}
              <td className="px-4 py-2 flex flex-col items-center gap-1">
                <StatusBadge status={lead.status} />
                <LeadStatusChanger lead={lead} />

              </td>

              {/* محصول */}
              <td className="px-4 py-2 text-center">
                {lead.product_name ? (
                  <div className="text-sm text-gray-700">
                    {lead.product_name} - {lead.product_quantity} عدد
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onAddProduct(lead)}
                  >
                    افزودن محصول
                  </Button>
                )}
              </td>

              {/* فاکتورها */}
              <td className="px-4 py-2 flex gap-1 justify-center">
                <Button size="sm" variant="outline" onClick={() => onInvoice(lead)} title="فاکتور">
                  <FileText size={16} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onPreInvoice(lead)} title="پیش‌فاکتور">
                  <FilePlus2 size={16} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDelivery(lead)} title="حواله">
                  <Truck size={16} />
                </Button>
              </td>

              {/* عملیات */}
              <td className="px-4 py-2 flex gap-1 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-500 hover:bg-blue-50"
                  onClick={() => onEdit(lead)}
                  title="ویرایش"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(lead)}
                  title="حذف"
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
