const express = require('express');
const { getPool } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/products — list all active products
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM products WHERE is_active = true';
    const params = [];

    if (category) { query += ' AND category = ?'; params.push(category); }
    if (search) { query += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const pool = getPool();
    const [products] = await pool.query(query, params);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM products WHERE is_active = true');

    res.json({ total, page: parseInt(page), limit: parseInt(limit), products });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/products/:id
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const [products] = await pool.query('SELECT * FROM products WHERE id = ? AND is_active = true', [req.params.id]);
    if (products.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(products[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/products — admin only
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, sku, image_url } = req.body;
    if (!name || !price || !sku) return res.status(400).json({ error: 'Name, price and SKU are required' });

    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, category, sku, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, category, sku, image_url]
    );
    res.status(201).json({ message: 'Product created', productId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'SKU already exists' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/v1/products/:id — admin only
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;
    const pool = getPool();
    await pool.query(
      'UPDATE products SET name=?, description=?, price=?, category=?, image_url=? WHERE id=?',
      [name, description, price, category, image_url, req.params.id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/products/:id — admin only (soft delete)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    await pool.query('UPDATE products SET is_active = false WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deactivated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
