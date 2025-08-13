import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const createUser = async (username, password) => {
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, hash]);
  return rows[0];
};

const findUserByUsername = async (username) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return rows[0];
};

export { createUser, findUserByUsername };