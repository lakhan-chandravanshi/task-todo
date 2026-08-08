import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

const statusColors = {
  Todo: 'bg-slate-600',
  'In Progress': 'bg-amber-600',
  Completed: 'bg-emerald-600'
};

export default function AdminDashboard() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '' });
  const [employeeForm, setEmployeeForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editingEmployeeForm, setEditingEmployeeForm] = useState({ name: '', email: '', password: '', role: 'employee' });

  const loadData = async () => {
    const [employeesRes, tasksRes] = await Promise.all([api.get('/employees'), api.get('/tasks')]);
    setEmployees(employeesRes.data);
    setTasks(tasksRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createEmployee = async (e) => {
    e.preventDefault();
    await api.post('/employees', employeeForm);
    setEmployeeForm({ name: '', email: '', password: '', role: 'employee' });
    loadData();
  };

  const createTask = async (e) => {
    e.preventDefault();
    await api.post('/tasks', form);
    setForm({ title: '', description: '', assignedTo: '' });
    loadData();
  };

  const startEditEmployee = (employee) => {
    setEditingEmployeeId(employee._id);
    setEditingEmployeeForm({ name: employee.name, email: employee.email, password: '', role: employee.role });
  };

  const cancelEditEmployee = () => {
    setEditingEmployeeId(null);
    setEditingEmployeeForm({ name: '', email: '', password: '', role: 'employee' });
  };

  const updateEmployee = async (e) => {
    e.preventDefault();
    await api.put(`/employees/${editingEmployeeId}`, editingEmployeeForm);
    cancelEditEmployee();
    loadData();
  };

  const deleteEmployee = async (id) => {
    await api.delete(`/employees/${id}`);
    loadData();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    loadData();
  };

  const counts = {
    totalEmployees: employees.length,
    totalTasks: tasks.length,
    todo: tasks.filter((task) => task.status === 'Todo').length,
    inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    completed: tasks.filter((task) => task.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-200">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Admin Workspace</p>
            <h1 className="text-3xl font-semibold">Welcome back, {user?.name}</h1>
          </div>
          <button className="rounded-xl border border-slate-700 px-4 py-2" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-5">
          {[
            ['Total Employees', counts.totalEmployees],
            ['Total Tasks', counts.totalTasks],
            ['Todo', counts.todo],
            ['In Progress', counts.inProgress],
            ['Completed', counts.completed]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="mb-4 text-xl font-semibold">Create employee</h2>
            <form onSubmit={createEmployee} className="grid gap-3 md:grid-cols-2">
              <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Name" value={employeeForm.name} onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })} required />
              <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Email" value={employeeForm.email} onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} required />
              <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Password" value={employeeForm.password} onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })} required />
              <select className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" value={employeeForm.role} onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <button className="md:col-span-2 rounded-xl bg-cyan-600 px-4 py-2 font-semibold">Add employee</button>
            </form>
            {editingEmployeeId && (
              <form onSubmit={updateEmployee} className="mt-6 grid gap-3 rounded-2xl border border-cyan-600/40 bg-slate-950/80 p-4 md:grid-cols-2">
                <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Name" value={editingEmployeeForm.name} onChange={(e) => setEditingEmployeeForm({ ...editingEmployeeForm, name: e.target.value })} required />
                <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Email" value={editingEmployeeForm.email} onChange={(e) => setEditingEmployeeForm({ ...editingEmployeeForm, email: e.target.value })} required />
                <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" placeholder="New password (optional)" value={editingEmployeeForm.password} onChange={(e) => setEditingEmployeeForm({ ...editingEmployeeForm, password: e.target.value })} />
                <select className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" value={editingEmployeeForm.role} onChange={(e) => setEditingEmployeeForm({ ...editingEmployeeForm, role: e.target.value })}>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="md:col-span-2 flex gap-2">
                  <button className="rounded-xl bg-cyan-600 px-4 py-2 font-semibold">Save changes</button>
                  <button type="button" className="rounded-xl border border-slate-700 px-4 py-2" onClick={cancelEditEmployee}>Cancel</button>
                </div>
              </form>
            )}

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800/80 text-left">
                  <tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Role</th><th className="px-3 py-2">Action</th></tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id} className="border-t border-slate-800">
                      <td className="px-3 py-2">{employee.name}</td>
                      <td className="px-3 py-2">{employee.email}</td>
                      <td className="px-3 py-2">{employee.role}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-3">
                          <button className="text-cyan-400" onClick={() => startEditEmployee(employee)}>Edit</button>
                          <button className="text-rose-400" onClick={() => deleteEmployee(employee._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="mb-4 text-xl font-semibold">Create task</h2>
            <form onSubmit={createTask} className="space-y-3">
              <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <textarea className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <select className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} required>
                <option value="">Select employee</option>
                {employees.map((employee) => <option key={employee._id} value={employee._id}>{employee.name}</option>)}
              </select>
              <button className="w-full rounded-xl bg-cyan-600 px-4 py-2 font-semibold">Assign task</button>
            </form>
            <div className="mt-6 space-y-3">
              {tasks.map((task) => (
                <div key={task._id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-slate-400">{task.description}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs text-white ${statusColors[task.status]}`}>{task.status}</span>
                  </div>
                  <p className="text-sm text-slate-500">Assigned to {task.assignedTo?.name}</p>
                  <button className="mt-3 text-sm text-rose-400" onClick={() => deleteTask(task._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
