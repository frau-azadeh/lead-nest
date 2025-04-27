// src/components/purchase/PurchaseOrdersList.tsx

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPurchaseOrders, updatePurchaseOrderStatus, createPurchaseOrder } from '../../features/purchase/purchaseSlice';
import { PurchaseOrder } from '../../types/purchaseOrder';
import PurchaseTable from './PurchaseTable';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

export default function PurchaseOrdersList() {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.purchase);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newQuantity, setNewQuantity] = useState<number>(1);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  const handleView = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await dispatch(updatePurchaseOrderStatus({ id: orderId, status: newStatus })).unwrap();
      toast.success('وضعیت سفارش با موفقیت تغییر کرد.');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('خطا در تغییر وضعیت سفارش.');
    }
  };

  const handleCreateOrder = async () => {
    try {
      await dispatch(createPurchaseOrder({
        product: newProduct,
        quantity: newQuantity,
      })).unwrap();

      toast.success('سفارش جدید با موفقیت ثبت شد');
      setIsAddModalOpen(false);
      setNewProduct('');
      setNewQuantity(1);
    } catch (error) {
      toast.error('خطا در ثبت سفارش');
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-blue-500">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">خطا در دریافت سفارشات: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">سفارشات خرید</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>+ افزودن سفارش</Button>
      </div>

      <PurchaseTable
        orders={orders}
        onView={handleView}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Modal تغییر وضعیت */}
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
          {selectedOrder && (
            <Button onClick={() => handleUpdateStatus(selectedOrder.id, newStatus)}>
              ثبت تغییر
            </Button>
          )}
        </div>
      </Modal>

      {/* Modal افزودن سفارش */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">افزودن سفارش جدید</h2>
          <input
            type="text"
            placeholder="نام محصول"
            className="border p-2 w-full"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
          />
          <input
            type="number"
            placeholder="تعداد"
            className="border p-2 w-full"
            value={newQuantity}
            onChange={(e) => setNewQuantity(Number(e.target.value))}
          />
          <Button onClick={handleCreateOrder}>ثبت سفارش</Button>
        </div>
      </Modal>
    </div>
  );
}
