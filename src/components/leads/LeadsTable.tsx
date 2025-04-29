import { Lead } from '../../types/lead';
import Table from '../ui/Table';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui';
import StatusBadge from './StatusBadge';
import LeadStatusChanger from './LeadStatusChanger';

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export default function LeadsTable({ leads, onEdit, onDelete }: LeadsTableProps) {
  const handleDeleteClick = (lead: Lead) => {
    toast.custom((t) => (
      <div className="bg-white shadow-md rounded-lg px-4 py-3 text-sm max-w-md w-full border">
        <p className="text-gray-800 mb-3">آیا از حذف این سرنخ مطمئن هستید؟</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.dismiss(t.id)}
          >
            انصراف
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onDelete(lead);
              toast.dismiss(t.id);
              toast.success('سرنخ با موفقیت حذف شد');
            }}
          >
            بله، حذف کن
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <Table
      leads={leads}
      onEdit={onEdit}
      onDelete={handleDeleteClick}
      renderStatus={(lead) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={lead.status} />
          <LeadStatusChanger lead={lead} />
        </div>
      )}
    />
  );
}
