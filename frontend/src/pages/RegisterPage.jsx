import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function RegisterPage() {
  const { register, error, loading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [validationError, setValidationError] = useState('');

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.name.trim()) {
      setValidationError('Name is required.');
      return false;
    }
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
      await register({ ...form, name: form.name.trim(), email: form.email.trim() });
      navigate('/employee');
    } catch {
      // error handled in store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold">Create account</h1>
          <p className="mt-2 text-slate-400">Join the team and start collaborating</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          {(validationError || error) && <p className="text-sm text-rose-400">{validationError || error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-cyan-600 py-3 font-semibold transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already registered? <Link className="text-cyan-400" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
