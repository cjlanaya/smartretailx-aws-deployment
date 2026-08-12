const express = require('express');
const axios = require('axios');
const { getPool } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const INVENTORY_SERVICE = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3004';

// POST /api/v1/orders — place a new order
router.post('/', verifyToken, async (req, res) => {
  const { items, shipping_address } = req.body;
  if (!items || items.length === 0 || !shipping_address) {
    return res.status(400).json({ error: 'Items and shipping address are required' });
  }

  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Check inventory for each item and reserve stock
    for (const item of items) {
      try {
        await axios.post(`${INVENTORY_SERVICE}/api/v1/inventory/reserve`, {
          product_id: item.product_id,
          quantity: item.quantity
        }, { headers: { Authorization: req.headers['authorization'] } });
      } catch (err) {
        await conn.rollback();
        return res.status(400).json({
          error: `Insufficient stock for product ${item.product_id}`
        });
      }
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

    // Create order
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)',
      [req.user.userId, total.toFixed(2), shipping_address]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.product_name, item.quantity, item.unit_price]
      );
    }

    await conn.commit();

    // Notify user and admin
    const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006';
    try {
      await axios.post(`${NOTIFICATION_SERVICE}/api/v1/notifications`, {
        user_id: req.user.userId,
        type: 'order_placed',
        title: '🛍️ Order Placed Successfully',
        message: `Your order #${orderId} has been placed for $${total.toFixed(2)}. We are processing it now.`,
        order_id: orderId
      }, { headers: { Authorization: req.headers['authorization'] } });
    } catch (e) { console.log('Notification failed silently'); }

    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      total: total.toFixed(2),
      status: 'pending'
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  } finally {
    conn.release();
  }
});

// GET /api/v1/orders — get own orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json({ total: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/orders/:id — get order details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
    if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });

    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    res.json({ ...orders[0], items });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/v1/orders/:id/status — admin only
router.patch('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending','confirmed','processing','shipped','delivered','cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const pool = getPool();
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated', status });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/orders/admin/all — admin: see all orders
router.get('/admin/all', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json({ total: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
