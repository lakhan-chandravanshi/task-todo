import Task from '../models/Task.js';
import User from '../models/User.js';

export const createTask = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { title, description, assignedTo, status } = req.body;
    if (!title || !description || !assignedTo) {
      return res.status(400).json({ message: 'Please provide title, description and assigned employee' });
    }

    const employee = await User.findById(assignedTo);
    if (!employee || employee.role !== 'employee') {
      return res.status(400).json({ message: 'Assigned employee is invalid' });
    }

    const task = await Task.create({ title, description, assignedTo, status: status || 'Todo', createdBy: req.user._id });
    const populated = await task.populate([{ path: 'assignedTo', select: '-password' }, { path: 'createdBy', select: '-password' }]);
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
    const tasks = await Task.find(query).populate('assignedTo', '-password').populate('createdBy', '-password').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', '-password').populate('createdBy', '-password');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedTo', '-password').populate('createdBy', '-password');
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

export const assignTask = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    const employee = await User.findById(assignedTo);
    if (!employee || employee.role !== 'employee') return res.status(400).json({ message: 'Invalid employee' });

    task.assignedTo = assignedTo;
    await task.save();
    const populated = await task.populate('assignedTo', '-password');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.assignedTo.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });

    task.status = status;
    await task.save();
    const populated = await task.populate('assignedTo', '-password');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};
