import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

const statusColors = {
  Todo: 'bg-slate-600',
  'In Progress': 'bg-amber-600',
  Completed: 'bg-emerald-600'
};

export default function EmployeeDashboard() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/tasks/${id}/status`, { status });
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-200">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Employee Portal</p>
            <h1 className="text-3xl font-semibold">Hello, {user?.name}</h1>
          </div>
          <button className="rounded-xl border border-slate-700 px-4 py-2" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            ['Assigned', tasks.length],
            ['Todo', tasks.filter((task) => task.status === 'Todo').length],
            ['Completed', tasks.filter((task) => task.status === 'Completed').length]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{task.title}</h2>
                  <p className="mt-1 text-slate-400">{task.description}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm text-white ${statusColors[task.status]}`}>{task.status}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Todo', 'In Progress', 'Completed'].map((status) => (
                  <button key={status} className="rounded-xl border border-slate-700 px-3 py-2 text-sm" onClick={() => updateStatus(task._id, status)}>{status}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
