import express from 'express';
import { assignTask, createTask, deleteTask, getTask, getTasks, updateTask, updateTaskStatus } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/assign', assignTask);
router.put('/:id/status', updateTaskStatus);

export default router;
