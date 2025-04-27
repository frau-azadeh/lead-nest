import { PurchaseOrder } from '../../types/purchaseOrder';
import  Button  from '../ui/Button';

interface PurchaseTableProps {
  orders: PurchaseOrder[];
  onView: (order: PurchaseOrder) => void;
  onUpdateStatus: (orderId: string, newStatus: string) => void;

}

export default function PurchaseTable({ orders, onView, onUpdateStatus }: PurchaseTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        سفارشی ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-4">محصول</th>
            <th className="p-4">تعداد</th>
            <th className="p-4">وضعیت</th>
            <th className="p-4">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((orderId) => (
            <tr key={orderId.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{orderId.product}</td>
              <td className="p-4">{orderId.quantity}</td>
              <td className="p-4">
                <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                  {orderId.status}
                </span>
              </td>
              <td className="p-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onView(orderId)}
                >
                  مشاهده
                </Button>
                <Button size="sm" onClick={() => onUpdateStatus(orderId.id, 'تایید شده')}>
                  تایید
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
