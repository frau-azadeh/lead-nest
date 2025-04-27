// src/pages/PurchaseDashboard.tsx

import PurchaseOrdersList from '../components/purchase/PurchaseOrdersList';

export default function PurchaseDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">مدیریت سفارشات خرید</h1>
      <PurchaseOrdersList />
    </div>
  );
}
