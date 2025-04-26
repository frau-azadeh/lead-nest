import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LeadsPage from './pages/LeadsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/leads" replace />} />
        <Route path="/leads" element={<LeadsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
