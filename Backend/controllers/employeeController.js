import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const createEmployee = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: role || 'employee' });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password').sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

export const getEmployee = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const { name, email, password, role } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (email && email !== employee.email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    next(error);
  }
};
