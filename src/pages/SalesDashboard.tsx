// src/pages/SalesDashboard.tsx

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSales, deleteSale, updateStatus, setProduct } from '../features/sales/salesSlice';
import SalesTable from '../components/sales/SalesTable';
import { toast } from 'react-hot-toast';
import { LeadWithProduct } from '../types/LeadWithProduct';

export default function SalesDashboard() {
  const dispatch = useAppDispatch();
  const { sales, loading, error } = useAppSelector((state) => state.sales);

  // 👉 فچ داده‌ها
  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  const handleDelete = async (lead: LeadWithProduct) => {
    try {
      await dispatch(deleteSale(lead.id)).unwrap();
      toast.success('مشتری با موفقیت حذف شد');
    } catch (err) {
      toast.error('حذف مشتری ناموفق بود');
    }
  };

  const handleAddProduct = async (lead: LeadWithProduct) => {
    const productName = prompt('نام محصول؟');
    const productQuantityStr = prompt('تعداد محصول؟');
    const productQuantity = Number(productQuantityStr);

    if (!productName || isNaN(productQuantity)) {
      toast.error('اطلاعات محصول نامعتبر است');
      return;
    }

    dispatch(setProduct({
      id: lead.id,
      product_name: productName,
      product_quantity: productQuantity,
    }));

    toast.success('محصول اضافه شد (محلی)');
  };

  const handleChangeStatus = async (lead: LeadWithProduct) => {
    const status = prompt('وضعیت جدید؟ (new/contacted/qualified/lost)');
    if (!status) return;

    try {
      await dispatch(updateStatus({ id: lead.id, status })).unwrap();
      toast.success('وضعیت با موفقیت تغییر کرد');
    } catch (err) {
      toast.error('تغییر وضعیت ناموفق بود');
    }
  };

  const handleInvoice = (lead: LeadWithProduct) => {
    toast('فاکتور برای ' + lead.full_name);
  };

  const handlePreInvoice = (lead: LeadWithProduct) => {
    toast('پیش‌فاکتور برای ' + lead.full_name);
  };

  const handleDelivery = (lead: LeadWithProduct) => {
    toast('حواله برای ' + lead.full_name);
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطا: {error}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">داشبورد فروش</h1>
      <SalesTable
        sales={sales}
        onEdit={(lead) => console.log('ویرایش:', lead)}
        onDelete={handleDelete}
        onAddProduct={handleAddProduct}
        onChangeStatus={handleChangeStatus}
        onInvoice={handleInvoice}
        onPreInvoice={handlePreInvoice}
        onDelivery={handleDelivery}
      />
    </div>
  );
}
