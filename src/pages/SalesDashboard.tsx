// src/pages/SalesDashboard.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchLeads, deleteLead, setEditingLead } from '../features/leads/leadsSlice';
import { createInvoice } from '../features/invoices/invoicesSlice'; // 👈 اضافه شد
import SalesTable from '../components/sales/SalesTable';
import LeadForm from '../components/forms/LeadForm';
import { toast } from 'react-hot-toast';
import { Lead } from '../types/lead';

export default function SalesDashboard() {
  const dispatch = useAppDispatch();
  const { leads, loading, error } = useAppSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  const handleDelete = async (lead: Lead) => {
    try {
      await dispatch(deleteLead(lead.id)).unwrap();
      toast.success('مشتری حذف شد');
    } catch {
      toast.error('حذف ناموفق');
    }
  };

  const handleAddProduct = async (lead: Lead, productName: string, productQuantity: number) => {
    try {
      await dispatch(
        createInvoice({
          lead_id: lead.id,
          type: 'invoice',
          amount: productQuantity,
          product_name: productName, // 👈 اضافه شد
        })
      ).unwrap();
      toast.success('محصول به فاکتور اضافه شد');
    } catch {
      toast.error('خطا در افزودن محصول');
    }
  };

  const handleEdit = (lead: Lead) => {
    dispatch(setEditingLead(lead));
  };

  const handleInvoice = (lead: Lead) => toast(`فاکتور برای ${lead.full_name}`);
  const handlePreInvoice = (lead: Lead) => toast(`پیش‌فاکتور برای ${lead.full_name}`);
  const handleDelivery = (lead: Lead) => toast(`حواله برای ${lead.full_name}`);

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطا: {error}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">داشبورد فروش</h1>
      <LeadForm />
      <SalesTable
        leads={leads}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddProduct={handleAddProduct}
        onInvoice={handleInvoice}
        onPreInvoice={handlePreInvoice}
        onDelivery={handleDelivery}
      />
    </div>
  );
}
