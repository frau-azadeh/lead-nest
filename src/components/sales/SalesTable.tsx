import { useState } from 'react';
import { Edit, Trash2, FileText, FilePlus2, Truck } from 'lucide-react';
import { Button } from '../../components/ui';
import { Lead } from '../../types/lead';
import StatusBadge from '../leads/StatusBadge';
import LeadStatusChanger from '../leads/LeadStatusChanger';
import { toast } from 'react-hot-toast';
import ProductModal from './ProductModal'; // ✅ اضافه شد

interface SalesTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onAddProduct: (lead: Lead, productName: string, productQuantity: number) => void; // 👈 تغییر
  onInvoice: (lead: Lead) => void;
  onPreInvoice: (lead: Lead) => void;
  onDelivery: (lead: Lead) => void;
}

export default function SalesTable({
  leads = [],
  onEdit,
  onDelete,
  onAddProduct,
  onInvoice,
  onPreInvoice,
  onDelivery,
}: SalesTableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isProductModalOpen, setProductModalOpen] = useState(false);

  const handleDeleteConfirm = (lead: Lead) => {
    toast((t) => (
      <div className="p-4">
        <p>آیا از حذف "{lead.full_name}" مطمئن هستید؟</p>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="secondary" onClick={() => toast.dismiss(t.id)}>
            انصراف
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(lead);
              toast.dismiss(t.id);
            }}
          >
            بله، حذف کن
          </Button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const openProductModal = (lead: Lead) => {
    setSelectedLead(lead);
    setProductModalOpen(true);
  };

  const handleProductSave = (productName: string, productQuantity: number) => {
    if (selectedLead) {
      onAddProduct(selectedLead, productName, productQuantity);
    }
  };

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
          {leads.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">داده‌ای یافت نشد</td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{lead.full_name}</td>
                <td className="px-4 py-2">{lead.email}</td>
                <td className="px-4 py-2">{lead.phone_number}</td>
                <td className="px-4 py-2">{lead.company}</td>
                <td className="px-4 py-2 flex flex-col items-center gap-1">
                  <StatusBadge status={lead.status} />
                  <LeadStatusChanger lead={lead} />
                </td>
                <td className="px-4 py-2 text-center">
                  {lead.product_name ? (
                    <div className="text-sm text-gray-700">
                      {lead.product_name} - {lead.product_quantity} عدد
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openProductModal(lead)}
                    >
                      افزودن محصول
                    </Button>
                  )}
                </td>
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
                    onClick={() => handleDeleteConfirm(lead)}
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 👇 Product Modal */}
      <ProductModal
        lead={selectedLead}
        isOpen={isProductModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSave={handleProductSave}
      />
    </div>
  );
}
