import { useEffect, useState } from 'react';
import { Modal, Button, Input } from '../../components/ui';
import { Lead } from '../../types/lead';
import { supabase } from '../../lib/supabaseClient';
import { Invoice } from '../../types/invoice';
import { toast } from 'react-hot-toast';

interface ProductModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // وقتی محصول جدید یا ویرایش ذخیره شد
}

export default function ProductModal({ lead, isOpen, onClose, onSave }: ProductModalProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);

  useEffect(() => {
    if (lead && isOpen) {
      fetchInvoices();
      clearForm();
    }
  }, [lead, isOpen]);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('lead_id', lead!.id);
    if (error) {
      toast.error('خطا در دریافت محصولات');
    } else {
      setInvoices(data ?? []);
    }
    setLoading(false);
  };

  const clearForm = () => {
    setProductName('');
    setProductQuantity(1);
    setEditingInvoice(null);
  };

  const handleEditClick = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setProductName(invoice.product_name ?? '');
    setProductQuantity(invoice.amount);
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    if (editingInvoice) {
      // UPDATE
      const { data, error } = await supabase
        .from('invoices')
        .update({
          product_name: productName,
          amount: productQuantity,
        })
        .eq('id', editingInvoice.id)
        .select()
        .maybeSingle();

      if (error) {
        toast.error('خطا در ویرایش محصول: ' + error.message);
      } else if (!data) {
        toast('ویرایش انجام شد ولی داده‌ای برنگشت');
      } else {
        toast.success('محصول ویرایش شد');
      }

      await fetchInvoices();
      clearForm();
      onSave();
    } else {
      // INSERT
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          lead_id: lead.id,
          type: 'invoice',
          amount: productQuantity,
          product_name: productName,
        })
        .select()
        .maybeSingle();

      if (error) {
        toast.error('خطا در افزودن محصول: ' + error.message);
      } else if (!data) {
        toast('افزودن انجام شد ولی داده‌ای برنگشت');
      } else {
        toast.success('محصول اضافه شد');
      }

      await fetchInvoices();
      clearForm();
      onSave();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-lg font-bold mb-4">
        مدیریت محصولات برای {lead?.full_name}
      </h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">محصولات قبلی</h3>
        {loading ? (
          <p>در حال بارگذاری...</p>
        ) : invoices.length === 0 ? (
          <p>محصولی ثبت نشده است.</p>
        ) : (
          <ul className="list-disc ml-4 space-y-1">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between">
                <span>{inv.product_name} - {inv.amount} عدد</span>
                <Button size="sm" onClick={() => handleEditClick(inv)}>ویرایش</Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="نام محصول"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <Input
          label="تعداد محصول"
          type="number"
          min={1}
          value={productQuantity}
          onChange={(e) => setProductQuantity(Number(e.target.value))}
          required
        />

        <div className="flex justify-end gap-2">
          {editingInvoice && (
            <Button variant="secondary" onClick={clearForm}>
              لغو ویرایش
            </Button>
          )}
          <Button type="submit">
            {editingInvoice ? 'ذخیره ویرایش' : 'افزودن محصول'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
