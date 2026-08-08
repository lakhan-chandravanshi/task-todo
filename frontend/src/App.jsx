import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

const ProtectedRoute = ({ children, role }) => {
  const { user, token, loadUser } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      await loadUser();
      setChecked(true);
    };
    hydrate();
  }, []);

  if (!token) return <Navigate to="/login" replace />;
  if (!checked) return <div className="min-h-screen flex items-center justify-center text-slate-300">Loading...</div>;
  if (role && user?.role !== role) return <Navigate to={user?.role === 'admin' ? '/admin' : '/employee'} replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/employee" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
