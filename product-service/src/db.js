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
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      category VARCHAR(100),
      sku VARCHAR(100) UNIQUE NOT NULL,
      image_url VARCHAR(500),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  console.log('Products table ready');
}

function getPool() { return pool; }

module.exports = { initDB, getPool };
