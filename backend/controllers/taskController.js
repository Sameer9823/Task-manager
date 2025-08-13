import { createTask, findTasksByUserId, findTaskByIdAndUserId, updateTask, deleteTask } from '../models/taskModel.js';

const getTasks = async (req, res) => {
  const { status } = req.query;
  try {
    const tasks = await findTasksByUserId(req.user.id, status);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

const createTaskHandler = async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  if (!title) return res.status(400).json({ message: 'Title required' });
  try {
    const task = await createTask(req.user.id, title, description, status, dueDate);
    res.status(201).json({ id: task.id, message: 'Task created' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

const updateTaskHandler = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;
  try {
    const task = await findTaskByIdAndUserId(id, req.user.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await updateTask(id, title || task.title, description || task.description, status || task.status, dueDate || task.due_date);
    res.json({ message: 'Task updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

const deleteTaskHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await findTaskByIdAndUserId(id, req.user.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await deleteTask(id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

export { getTasks, createTaskHandler, updateTaskHandler, deleteTaskHandler };