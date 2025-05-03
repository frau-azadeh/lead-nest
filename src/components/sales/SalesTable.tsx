import { LeadWithProduct } from '../../types/LeadWithProduct';
import Table from '../ui/Table';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui';
import StatusBadge from '../leads/StatusBadge';

interface SalesTableProps {
  sales: LeadWithProduct[];
  onEdit: (lead: LeadWithProduct) => void;
  onDelete: (lead: LeadWithProduct) => void;
  onAddProduct: (lead: LeadWithProduct) => void;
  onChangeStatus: (lead: LeadWithProduct) => void;
}

export default function SalesTable({
  sales,
  onEdit,
  onDelete,
  onAddProduct,
  onChangeStatus,
}: SalesTableProps) {
  const handleDeleteClick = (lead: LeadWithProduct) => {
    toast.custom((t) => (
      <div className="bg-white shadow-md rounded-lg px-4 py-3 text-sm max-w-md w-full border">
        <p className="text-gray-800 mb-3">آیا از حذف این مشتری مطمئن هستید؟</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.dismiss(t.id)}
          >
            انصراف
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onDelete(lead);
              toast.dismiss(t.id);
              toast.success('مشتری با موفقیت حذف شد');
            }}
          >
            بله، حذف کن
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <Table<LeadWithProduct>
      leads={sales}
      onEdit={onEdit}
      onDelete={handleDeleteClick}
      renderStatus={(lead) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={lead.status} />
            <Button size="sm" onClick={() => onChangeStatus(lead)}>
              تغییر وضعیت
            </Button>
          </div>

          {lead.product_name ? (
            <div className="text-sm text-gray-600">
              {lead.product_name} - {lead.product_quantity} عدد
            </div>
          ) : (
            <Button size="sm" onClick={() => onAddProduct(lead)}>
              افزودن محصول
            </Button>
          )}

          <div className="flex gap-1">
            <Button size="sm" onClick={() => alert('فاکتور')}>
              فاکتور
            </Button>
            <Button size="sm" onClick={() => alert('پیش‌فاکتور')}>
              پیش‌فاکتور
            </Button>
            <Button size="sm" onClick={() => alert('حواله')}>
              حواله
            </Button>
          </div>
        </div>
      )}
    />
  );
}
