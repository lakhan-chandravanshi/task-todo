import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const { login, error, loading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      setValidationError('Email is required.');
      return false;
    }
    if (!emailRegex.test(form.email.trim())) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    if (!form.password) {
      setValidationError('Password is required.');
      return false;
    }
    if (form.password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login({ ...form, email: form.email.trim() });
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'admin') navigate('/admin');
      else navigate('/employee');
    } catch {
      // error handled in store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold">TaskFlow</h1>
          <p className="mt-2 text-slate-400">Sign in to manage your teams and tasks</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {(validationError || error) && <p className="text-sm text-rose-400">{validationError || error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-cyan-600 py-3 font-semibold transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          New here? <Link className="text-cyan-400" to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
