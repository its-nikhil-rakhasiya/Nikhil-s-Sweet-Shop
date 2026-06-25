import mysql from 'mysql2/promise';
import 'dotenv/config';

async function patchDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nikhil-sweet-shop',
    ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : undefined
  };

  console.log('Connecting to database...');
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Check if the 'status' column already exists in 'order_items'
    const [columns] = await connection.query(`
      SHOW COLUMNS FROM order_items LIKE 'status'
    `);

    if (columns.length === 0) {
      console.log("Adding missing 'status' column to 'order_items' table...");
      await connection.query(`
        ALTER TABLE order_items 
        ADD COLUMN status ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending'
      `);
      console.log("✅ Column 'status' successfully added to 'order_items'!");
    } else {
      console.log("ℹ️ Column 'status' already exists in 'order_items' table. No changes needed.");
    }
  } catch (error) {
    console.error('❌ Failed to patch database:', error.message);
  } finally {
    await connection.end();
  }
}

patchDatabase();
