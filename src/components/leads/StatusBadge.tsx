// src/components/leads/StatusBadge.tsx

interface StatusBadgeProps {
    status: string;
  }
  
  const statusColors: Record<string, string> = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500',
    qualified: 'bg-green-500',
    lost: 'bg-red-500',
  };
  
  export default function StatusBadge({ status }: StatusBadgeProps) {
    const color = statusColors[status] || 'bg-gray-400';
  
    return (
      <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${color}`}>
        {translateStatus(status)}
      </span>
    );
  }
  
  function translateStatus(status: string) {
    switch (status) {
      case 'new':
        return 'جدید';
      case 'contacted':
        return 'تماس گرفته شده';
      case 'qualified':
        return 'مشتری بالقوه';
      case 'lost':
        return 'از دست رفته';
      default:
        return 'نامشخص';
    }
  }
  