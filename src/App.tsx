import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LeadsPage from './pages/LeadsPage';
import Navbar from './components/layout/Navbar';
import { Toaster } from 'react-hot-toast'; // فقط اینجا Toaster فعال بمونه
import './App.css';

function App() {
  return (
    <Router>
      {/* Toast برای کل پروژه */}
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

      {/* نوار ناوبری */}
      <Navbar />

      {/* محتوای اصلی */}
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="/leads" element={<LeadsPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
