import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPurchaseOrders, updatePurchaseOrderStatus } from '../../features/purchase/purchaseSlice';
import { PurchaseOrder } from '../../types/purchaseOrder';
import PurchaseTable from './PurchaseTable';
import AddPurchaseOrderModal from './AddPurchaseOrderModal';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

export default function PurchaseOrdersList() {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.purchase);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter(order =>
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    try {
      await dispatch(updatePurchaseOrderStatus({ id: selectedOrder.id, status: newStatus })).unwrap();
      toast.success('وضعیت با موفقیت بروزرسانی شد!');
      setIsModalOpen(false);
    } catch {
      toast.error('خطا در تغییر وضعیت سفارش');
    }
  };

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">سفارشات خرید</h1>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی محصول..."
            className="max-w-xs"
          />
          <Button onClick={() => setIsAddModalOpen(true)}>➕ ثبت سفارش جدید</Button>
        </div>
      </div>

      <PurchaseTable orders={filteredOrders} onView={handleView} />

      {/* مودال تغییر وضعیت */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">تغییر وضعیت سفارش</h2>
          <select
            className="border p-2 w-full"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="در انتظار">در انتظار</option>
            <option value="تایید شده">تایید شده</option>
            <option value="تحویل داده شده">تحویل داده شده</option>
          </select>
          <Button onClick={handleSaveStatus}>ثبت تغییر</Button>
        </div>
      </Modal>

      {/* مودال ثبت سفارش جدید */}
      <AddPurchaseOrderModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
