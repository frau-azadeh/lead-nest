import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchLeads, deleteLead, setEditingLead } from '../features/leads/leadsSlice';
import LeadForm from '../components/forms/LeadForm';
import LeadsTable from '../components/leads/LeadsTable';
import LeadFilters from '../components/leads/LeadFilters';
import { Pagination } from '../components/ui';
import { usePagination } from '../components/hooks/usePagination';
import { toast } from 'react-hot-toast';
import { Lead } from '../types/lead';
import { Button } from '../components/ui';

export default function LeadsPage() {
  const dispatch = useAppDispatch();
  const { leads, loading, error } = useAppSelector((state) => state.leads);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { paginatedItems, totalPages } = usePagination<Lead>(filteredLeads, currentPage, itemsPerPage);

  const handleEdit = (lead: Lead) => {
    dispatch(setEditingLead(lead));
  };

  const handleDelete = (lead: Lead) => {
    toast.custom((t) => (
      <div className="bg-white shadow rounded p-4">
        <p>آیا از حذف "{lead.full_name}" مطمئن هستید؟</p>
        <div className="flex justify-end gap-2 mt-2">
          <Button onClick={() => toast.dismiss(t.id)}>انصراف</Button>
          <Button variant="destructive" onClick={async () => {
            try {
              await dispatch(deleteLead(lead.id)).unwrap();
              toast.dismiss(t.id);
              toast.success('حذف شد!');
            } catch {
              toast.error('خطا در حذف!');
            }
          }}>
            حذف کن
          </Button>
        </div>
      </div>
    ));
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">سرنخ‌ها</h1>

      <LeadFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <LeadForm />

      <div className="mt-8">
        <LeadsTable leads={paginatedItems} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {loading && <p className="text-center mt-4">در حال بارگذاری...</p>}
      {error && <p className="text-center text-red-500 mt-4">خطا: {error}</p>}
    </div>
  );
}
