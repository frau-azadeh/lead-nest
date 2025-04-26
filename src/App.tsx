// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LeadsPage from './pages/LeadsPage';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
import PurchaseDashboard from './pages/PurchaseDashboard';
import LoginPage from './pages/LoginPage';
import Navbar from './components/layout/Navbar';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './routes/ProtectedRoute';

import './App.css';

function App() {
  return (
    <Router>
      <InnerApp />
    </Router>
  );
}

function InnerApp() {
  const location = useLocation();

  const hideNavbarPaths = ['/login'];

  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'inherit',
            direction: 'rtl',
            textAlign: 'right',
          },
        }}
      />

      {shouldShowNavbar && <Navbar />}

      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'marketing', 'sales']} />}>
            <Route path="/leads" element={<LeadsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['sales']} />}>
            <Route path="/sales" element={<SalesDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['purchase']} />}>
            <Route path="/purchase" element={<PurchaseDashboard />} />
          </Route>

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={
            <div className="text-center py-10 text-red-500">
              شما اجازه دسترسی به این صفحه را ندارید.
            </div>
          } />
        </Routes>
      </main>
    </>
  );
}

export default App;
