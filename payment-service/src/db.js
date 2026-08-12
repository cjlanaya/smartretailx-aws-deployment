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
    try { await pool.query('SELECT 1'); console.log('Payment DB connected'); break; }
    catch { console.log(`Retrying DB... ${i + 1}/10`); await new Promise(r => setTimeout(r, 3000)); }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      user_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD',
      status ENUM('pending','success','failed','refunded') DEFAULT 'pending',
      payment_method VARCHAR(50) DEFAULT 'card',
      transaction_id VARCHAR(100) UNIQUE,
      card_last_four VARCHAR(4),
      failure_reason VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('Payments table ready');
}

function getPool() { return pool; }
module.exports = { initDB, getPool };
