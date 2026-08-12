const express = require('express');
const { getPool } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/v1/notifications — create notification (called by other services)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { user_id, type, title, message, order_id } = req.body;
    if (!user_id || !type || !title || !message) {
      return res.status(400).json({ error: 'user_id, type, title and message are required' });
    }
    const pool = getPool();

    // Create user notification
    await pool.query(
      'INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?, ?, ?, ?, ?)',
      [user_id, type, title, message, order_id || null]
    );

    // Also create admin notification for important events
    const adminEvents = ['order_placed', 'payment_success', 'payment_failed'];
    if (adminEvents.includes(type)) {
      await pool.query(
        'INSERT INTO notifications (user_id, type, title, message, order_id, is_admin_notified) VALUES (0, ?, ?, ?, ?, true)',
        [type, `[ADMIN] ${title}`, `User #${user_id}: ${message}`, order_id || null]
      );
    }

    res.status(201).json({ message: 'Notification created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/notifications/my — get my notifications
router.get('/my', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    const [notifications] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? AND is_admin_notified = false ORDER BY created_at DESC LIMIT 50',
      [req.user.userId]
    );
    const unread = notifications.filter(n => !n.is_read).length;
    res.json({ unread, total: notifications.length, notifications });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/v1/notifications/unread-count — for bell icon polling
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false AND is_admin_notified = false',
      [req.user.userId]
    );
    res.json({ unread: count });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// PATCH /api/v1/notifications/:id/read — mark as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );
    res.json({ message: 'Marked as read' });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// PATCH /api/v1/notifications/read-all — mark all as read
router.patch('/read-all', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE user_id = ? AND is_admin_notified = false',
      [req.user.userId]
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/v1/notifications/admin — admin: all notifications
router.get('/admin', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const [notifications] = await pool.query(
      'SELECT * FROM notifications WHERE is_admin_notified = true ORDER BY created_at DESC LIMIT 100'
    );
    const unread = notifications.filter(n => !n.is_read).length;
    res.json({ unread, total: notifications.length, notifications });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/v1/notifications/admin/unread-count
router.get('/admin/unread-count', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE is_admin_notified = true AND is_read = false'
    );
    res.json({ unread: count });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// PATCH /api/v1/notifications/admin/read-all
router.patch('/admin/read-all', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    await pool.query('UPDATE notifications SET is_read = true WHERE is_admin_notified = true');
    res.json({ message: 'All admin notifications marked as read' });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

module.exports = router;
