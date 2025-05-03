import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSales, deleteSale, updateStatus, setProduct } from '../features/sales/salesSlice';
import SalesTable from '../components/sales/SalesTable';
import { LeadWithProduct } from '../types/LeadWithProduct';
import { Button } from '../components/ui';
import Modal from '../components/ui/Modal';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-hot-toast';

export default function SalesDashboard() {
  const dispatch = useAppDispatch();
  const { sales, loading, error } = useAppSelector((state) => state.sales);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadWithProduct | null>(null);
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  const handleEdit = async (lead: LeadWithProduct) => {
    const newName = prompt('نام کامل جدید:', lead.full_name);
    const newCompany = prompt('نام شرکت جدید:', lead.company);
    if (newName && newCompany) {
      const { error } = await supabase
        .from('leads')
        .update({ full_name: newName, company: newCompany })
        .eq('id', lead.id);

      if (error) {
        toast.error('خطا در ویرایش');
        console.error(error);
      } else {
        toast.success('اطلاعات ویرایش شد');
        dispatch(fetchSales());
      }
    }
  };

  const handleDelete = (lead: LeadWithProduct) => {
    dispatch(deleteSale(lead.id));
  };

  const handleChangeStatus = (lead: LeadWithProduct) => {
    const newStatus = lead.status === 'new' ? 'تماس گرفته شده' : 'new';
    dispatch(updateStatus({ id: lead.id, status: newStatus }));
  };

  const handleAddProduct = (lead: LeadWithProduct) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (selectedLead) {
      const { error } = await supabase.from('invoices').insert({
        lead_id: selectedLead.id,
        type: productName,
        amount: productQuantity,
      });

      if (error) {
        toast.error('خطا در ذخیره محصول');
        console.error(error);
        return;
      }

      dispatch(
        setProduct({
          id: selectedLead.id,
          product_name: productName,
          product_quantity: productQuantity,
        })
      );

      toast.success('محصول با موفقیت ذخیره شد');
      setIsModalOpen(false);
      setProductName('');
      setProductQuantity(1);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">داشبورد فروش</h1>
      {loading && <p>در حال بارگیری...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <SalesTable
        sales={sales}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddProduct={handleAddProduct}
        onChangeStatus={handleChangeStatus}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-2">
          افزودن محصول به {selectedLead?.full_name}
        </h2>
        <div className="flex flex-col gap-2">
          <label>
            نام محصول:
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border p-1 w-full"
            />
          </label>
          <label>
            تعداد:
            <input
              type="number"
              value={productQuantity}
              onChange={(e) => setProductQuantity(Number(e.target.value))}
              className="border p-1 w-full"
            />
          </label>
          <Button onClick={handleSaveProduct}>ذخیره</Button>
        </div>
      </Modal>
    </div>
  );
}
