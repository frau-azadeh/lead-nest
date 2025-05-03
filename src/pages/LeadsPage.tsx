// src/pages/LeadsPage.tsx

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteLead, setEditingLead } from '../features/leads/leadsSlice';
import LeadForm from '../components/forms/LeadForm';
import LeadsTable from '../components/leads/LeadsTable';
import LeadFilters from '../components/leads/LeadFilters';
import { Pagination } from '../components/ui';
import { usePagination } from '../components/hooks/usePagination';
import { toast } from 'react-hot-toast';
import { Lead } from '../types/lead';

export default function LeadsPage() {
  const dispatch = useAppDispatch();
  const { leads } = useAppSelector((state) => state.leads);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const itemsPerPage = 5;

  // فیلتر کردن دیتا
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

      {/* 🔎 فیلتر سرچ + وضعیت */}
      <LeadFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* 📋 فرم ثبت یا ویرایش سرنخ */}
      <LeadForm />

      {/* 📋 جدول سرنخ‌ها */}
      <div className="mt-8">
        <LeadsTable leads={paginatedItems} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* 📄 صفحه‌بندی */}
      <div className="mt-6 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
