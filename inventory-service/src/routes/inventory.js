const express = require('express');
const { getPool } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/inventory — list all inventory (admin)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const [items] = await pool.query('SELECT * FROM inventory ORDER BY product_name');
    res.json({ total: items.length, inventory: items });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/inventory/:productId — get stock for a product
router.get('/:productId', async (req, res) => {
  try {
    const pool = getPool();
    const [items] = await pool.query('SELECT * FROM inventory WHERE product_id = ?', [req.params.productId]);
    if (items.length === 0) return res.status(404).json({ error: 'Product not found in inventory' });
    const item = items[0];
    res.json({
      product_id: item.product_id,
      product_name: item.product_name,
      available_quantity: item.quantity - item.reserved_quantity,
      total_quantity: item.quantity,
      reserved_quantity: item.reserved_quantity,
      reorder_level: item.reorder_level,
      low_stock: (item.quantity - item.reserved_quantity) <= item.reorder_level
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/inventory — add product to inventory (admin)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { product_id, product_name, quantity, reorder_level, warehouse_location } = req.body;
    if (!product_id || !product_name || quantity === undefined) {
      return res.status(400).json({ error: 'product_id, product_name and quantity are required' });
    }
    const pool = getPool();
    await pool.query(
      'INSERT INTO inventory (product_id, product_name, quantity, reorder_level, warehouse_location) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)',
      [product_id, product_name, quantity, reorder_level || 10, warehouse_location]
    );
    res.status(201).json({ message: 'Inventory updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/v1/inventory/:productId/restock — add stock (admin)
router.patch('/:productId/restock', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) return res.status(400).json({ error: 'Valid quantity required' });

    const pool = getPool();
    const [result] = await pool.query(
      'UPDATE inventory SET quantity = quantity + ? WHERE product_id = ?',
      [quantity, req.params.productId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: `Stock increased by ${quantity}` });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/inventory/reserve — called by order service
router.post('/reserve', verifyToken, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [items] = await conn.query(
        'SELECT * FROM inventory WHERE product_id = ? FOR UPDATE',
        [product_id]
      );

      if (items.length === 0) {
        await conn.rollback();
        return res.status(404).json({ error: 'Product not found in inventory' });
      }

      const item = items[0];
      const available = item.quantity - item.reserved_quantity;

      if (available < quantity) {
        await conn.rollback();
        return res.status(400).json({
          error: 'Insufficient stock',
          available,
          requested: quantity
        });
      }

      await conn.query(
        'UPDATE inventory SET reserved_quantity = reserved_quantity + ? WHERE product_id = ?',
        [quantity, product_id]
      );

      await conn.commit();
      res.json({ message: 'Stock reserved successfully', reserved: quantity });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/inventory/alerts/low-stock — admin: low stock alerts
router.get('/alerts/low-stock', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const [items] = await pool.query(
      'SELECT * FROM inventory WHERE (quantity - reserved_quantity) <= reorder_level ORDER BY quantity ASC'
    );
    res.json({ total: items.length, low_stock_items: items });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
