import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const seedUsers = async () => {
  const count = await User.countDocuments();
  if (count > 0) return;

  const adminPassword = await bcrypt.hash('admin123', 10);
  const employeePassword = await bcrypt.hash('employee123', 10);

  await User.create([
    { name: 'Admin User', email: 'admin@example.com', password: adminPassword, role: 'admin' },
    { name: 'Employee User', email: 'employee@example.com', password: employeePassword, role: 'employee' }
  ]);
};
