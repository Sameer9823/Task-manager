import pool from '../config/db.js';

const createTask = async (userId, title, description, status, dueDate) => {
  const { rows } = await pool.query(
    'INSERT INTO tasks (user_id, title, description, status, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [userId, title, description, status || 'Pending', dueDate]
  );
  return rows[0];
};

const findTasksByUserId = async (userId, status) => {
  let query = 'SELECT * FROM tasks WHERE user_id = $1';
  const params = [userId];
  if (status) {
    query += ' AND status = $2';
    params.push(status);
  }
  const { rows } = await pool.query(query, params);
  return rows;
};

const findTaskByIdAndUserId = async (id, userId) => {
  const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
  return rows[0];
};

const updateTask = async (id, title, description, status, dueDate) => {
  await pool.query(
    'UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
    [title, description, status, dueDate, id]
  );
};

const deleteTask = async (id) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
};

export { createTask, findTasksByUserId, findTaskByIdAndUserId, updateTask, deleteTask };