const mysql = require('mysql2/promise');

let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'smartretail123',
    database: process.env.DB_NAME || 'smartretailx',
    waitForConnections: true,
    connectionLimit: 10,
  });

  for (let i = 0; i < 10; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Connected to MySQL');
      break;
    } catch (err) {
      console.log(`MySQL not ready, retrying... (${i + 1}/10)`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      status ENUM('pending','confirmed','processing','shipped','delivered','cancelled') DEFAULT 'pending',
      total_amount DECIMAL(10,2) NOT NULL,
      shipping_address TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      product_name VARCHAR(200) NOT NULL,
      quantity INT NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `);

  console.log('Orders tables ready');
}

function getPool() { return pool; }
module.exports = { initDB, getPool };
