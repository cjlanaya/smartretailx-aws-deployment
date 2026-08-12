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
    try { await pool.query('SELECT 1'); console.log('Notification DB connected'); break; }
    catch { console.log(`Retrying DB... ${i + 1}/10`); await new Promise(r => setTimeout(r, 3000)); }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      order_id INT,
      is_read BOOLEAN DEFAULT false,
      is_admin_notified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Notifications table ready');
}

function getPool() { return pool; }
module.exports = { initDB, getPool };
