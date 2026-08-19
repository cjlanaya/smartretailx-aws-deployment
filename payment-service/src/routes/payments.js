const express = require('express');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { getPool } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006';

// POST /api/v1/payments/process — process a payment for an order
router.post('/process', verifyToken, async (req, res) => {
  const { order_id, amount, card_number, card_expiry, card_cvv } = req.body;

  if (!order_id || !amount || !card_number) {
    return res.status(400).json({ error: 'order_id, amount and card_number are required' });
  }

  const pool = getPool();

  // Check if already paid
  const [existing] = await pool.query(
    'SELECT * FROM payments WHERE order_id = ? AND status = "success"', [order_id]
  );
  if (existing.length > 0) return res.status(409).json({ error: 'Order already paid' });

  // Simulate payment processing
  const cardLast4 = card_number.toString().slice(-4);
  const transactionId = uuidv4();

  // Simulate 90% success rate (card ending in 0000 always fails for demo)
  const isSuccess = cardLast4 !== '0000' && Math.random() > 0.1;
  const status = isSuccess ? 'success' : 'failed';
  const failureReason = isSuccess ? null : 'Insufficient funds';

  // Save payment record
  await pool.query(
    `INSERT INTO payments (order_id, user_id, amount, status, transaction_id, card_last_four, failure_reason)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [order_id, req.user.userId, amount, status, transactionId, cardLast4, failureReason]
  );

  // Send notification
  try {
    await axios.post(`${NOTIFICATION_SERVICE}/notifications`, {
      user_id: req.user.userId,
      type: isSuccess ? 'payment_success' : 'payment_failed',
      title: isSuccess ? '✅ Payment Successful' : '❌ Payment Failed',
      message: isSuccess
        ? `Your payment of $${amount} for Order #${order_id} was successful. Transaction ID: ${transactionId}`
        : `Your payment of $${amount} for Order #${order_id} failed. Reason: ${failureReason}`,
      order_id
    }, { headers: { Authorization: req.headers['authorization'] } });
  } catch (e) { console.log('Notification failed silently'); }

  if (isSuccess) {
    res.status(200).json({
      message: 'Payment successful',
      transaction_id: transactionId,
      status: 'success',
      amount,
      card_last_four: cardLast4
    });
  } else {
    res.status(402).json({
      message: 'Payment failed',
      status: 'failed',
      failure_reason: failureReason
    });
  }
});

// GET /api/v1/payments/order/:orderId — get payment for an order
router.get('/order/:orderId', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    const [payments] = await pool.query(
      'SELECT * FROM payments WHERE order_id = ? AND user_id = ? ORDER BY created_at DESC',
      [req.params.orderId, req.user.userId]
    );
    res.json({ payments });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/v1/payments/my — get all my payments
router.get('/my', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    const [payments] = await pool.query(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json({ total: payments.length, payments });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/v1/payments — admin: all payments
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const [payments] = await pool.query('SELECT * FROM payments ORDER BY created_at DESC');
    const total = payments.filter(p => p.status === 'success').reduce((s, p) => s + parseFloat(p.amount), 0);
    res.json({ total_payments: payments.length, total_revenue: total.toFixed(2), payments });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// POST /api/v1/payments/refund/:id — admin refund
router.post('/refund/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const [payments] = await pool.query('SELECT * FROM payments WHERE id = ?', [req.params.id]);
    if (payments.length === 0) return res.status(404).json({ error: 'Payment not found' });
    if (payments[0].status !== 'success') return res.status(400).json({ error: 'Only successful payments can be refunded' });
    await pool.query('UPDATE payments SET status = "refunded" WHERE id = ?', [req.params.id]);
    res.json({ message: 'Payment refunded successfully' });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

module.exports = router;
