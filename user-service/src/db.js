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

  // Wait for MySQL to be ready (retry logic)
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

  // Create users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('customer', 'admin') DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  console.log('Users table ready');
}

function getPool() {
  return pool;
}

module.exports = { initDB, getPool };
