// src/pages/LeadsPage.tsx

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchLeads } from '../features/leads/leadsSlice';

export default function LeadsPage() {
  const dispatch = useAppDispatch();
  const { leads, loading, error } = useAppSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center text-xl">Loading Leads...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      <div className="grid grid-cols-1 gap-4">
        {leads.map((lead) => (
          <div key={lead.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{lead.full_name}</h2>
            <p>Email: {lead.email}</p>
            {lead.phone_number && <p>Phone: {lead.phone_number}</p>}
            {lead.company && <p>Company: {lead.company}</p>}
            <p>Status: {lead.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
