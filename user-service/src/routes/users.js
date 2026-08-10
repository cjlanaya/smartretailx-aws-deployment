const express = require('express');
const { getPool } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/users/profile — get own profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/users — admin only, list all users
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ total: users.length, users });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/v1/users/profile — update own profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const pool = getPool();
    await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, req.user.userId]);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/users/:id — admin only
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
