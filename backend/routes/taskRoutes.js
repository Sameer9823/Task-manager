import express from 'express';
import authenticate from '../middleware/authMiddleware.js';
import { getTasks, createTaskHandler, updateTaskHandler, deleteTaskHandler } from '../controllers/taskController.js';

const router = express.Router();

router.get('/', authenticate, getTasks);
router.post('/', authenticate, createTaskHandler);
router.put('/:id', authenticate, updateTaskHandler);
router.delete('/:id', authenticate, deleteTaskHandler);

export default router;