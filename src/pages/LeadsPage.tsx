import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteLead, setEditingLead } from '../features/leads/leadsSlice';
import LeadForm from '../components/forms/LeadForm';
import  Table  from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { usePagination } from '../components/hooks/usePagination';
import { toast } from 'react-hot-toast';
import { Lead } from '../types/lead';

export default function LeadsPage() {
  const dispatch = useAppDispatch();
  const { leads } = useAppSelector((state) => state.leads);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // 🔥 استیت سرچ
  const itemsPerPage = 5;

  // 🔥 فیلتر کردن بر اساس سرچ
  const filteredLeads = leads.filter((lead) =>
    lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { paginatedItems, totalPages } = usePagination<Lead>(filteredLeads, currentPage, itemsPerPage);

  const handleEdit = (lead: Lead) => {
    dispatch(setEditingLead(lead));
  };

  const handleDelete = async (lead: Lead) => {
    try {
      await dispatch(deleteLead(lead.id)).unwrap();
      toast.success('سرنخ با موفقیت حذف شد!');
    } catch (error) {
      toast.error('خطا در حذف سرنخ!');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">سرنخ‌ها</h1>
      </div>

      {/* 🔎 Input سرچ */}
      <div className="flex justify-end mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس نام یا ایمیل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full max-w-md"
        />
      </div>

      <LeadForm />

      <Table leads={paginatedItems} onEdit={handleEdit} onDelete={handleDelete} />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
