import express from 'express';
import { createEmployee, deleteEmployee, getEmployee, getEmployees, updateEmployee } from '../controllers/employeeController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);
router.route('/').get(getEmployees).post(createEmployee);
router.route('/:id').get(getEmployee).put(updateEmployee).delete(deleteEmployee);

export default router;
