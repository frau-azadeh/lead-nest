import { PurchaseOrder } from '../../types/purchaseOrder';
import { Button } from '../../components/ui';
import { cn } from '../../utils/cn';

interface PurchaseTableProps {
  orders: PurchaseOrder[];
  onView: (order: PurchaseOrder) => void;
}

export default function PurchaseTable({ orders, onView }: PurchaseTableProps) {
  if (orders.length === 0) {
    return <div className="text-center text-gray-500 py-10">سفارشی ثبت نشده است.</div>;
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
          {orders.map((order, index) => (
            <tr
              key={order.id}
              className={cn(
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                'border-b hover:bg-gray-100'
              )}
            >
              <td className="p-4">{order.product}</td>
              <td className="p-4">{order.quantity}</td>
              <td className="p-4">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs',
                    order.status === 'در انتظار' && 'bg-yellow-100 text-yellow-700',
                    order.status === 'تایید شده' && 'bg-green-100 text-green-700',
                    order.status === 'تحویل داده شده' && 'bg-blue-100 text-blue-700'
                  )}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-4">
                <Button size="sm" variant="outline" onClick={() => onView(order)}>
                  مشاهده
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
