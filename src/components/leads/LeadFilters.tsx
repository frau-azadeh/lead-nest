// src/components/leads/LeadFilters.tsx

import { Input } from '../../components/ui';
import Select from '../../components/ui/Select';

interface LeadFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export default function LeadFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-end mb-6">
      <Input
        placeholder="جستجو بر اساس نام یا ایمیل..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-64"
      />
      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        options={[
          { value: 'all', label: 'همه وضعیت‌ها' },
          { value: 'new', label: 'جدید' },
          { value: 'contacted', label: 'تماس گرفته شده' },
          { value: 'qualified', label: 'مشتری بالقوه' },
          { value: 'lost', label: 'از دست رفته' },
        ]}
        className="w-full sm:w-64"
      />
    </div>
  );
}
