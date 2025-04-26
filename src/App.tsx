// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LeadsPage from './pages/LeadsPage';
import Navbar from './components/layout/Navbar';
import { Toaster } from 'react-hot-toast'; // اگه اینجا باشه، Toast همیشه فعاله
import './App.css';

function App() {
  return (
    <Router>
      {/* Toast ها */}
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

      {/* ناوبری ثابت بالای همه صفحات */}
      <Navbar />

      {/* محتوای صفحه ها */}
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="/leads" element={<LeadsPage />} />
          {/* آینده: صفحه های دیگه اینجا اضافه میشن */}
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
