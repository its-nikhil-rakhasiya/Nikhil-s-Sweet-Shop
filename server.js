import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { createServer } from 'vite';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'nikhil-sweet-shop'
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Test DB connection
(async () => {
  try {
    await pool.getConnection();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
})();

// Get all sweets
app.get('/api/sweets', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM sweets');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching sweets:', error);
    res.status(500).json({ error: 'Error fetching sweets', details: error.message });
  }
});

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [admins] = await pool.execute(
      'SELECT id, username, email FROM admins WHERE email = ? AND password = ?',
      [email, password]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    res.json({
      user: {
        id: admins[0].id,
        username: admins[0].username,
        email: admins[0].email
      },
      message: 'Admin login successful'
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Error during login', details: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email is banned
    const [bannedCheck] = await pool.execute(
      'SELECT id FROM banned_emails WHERE email = ?',
      [email]
    );

    if (bannedCheck.length > 0) {
      return res.status(403).json({ error: 'This email has been banned. Contact support for assistance.' });
    }

    const [users] = await pool.execute(
      'SELECT id, email, full_name, is_banned FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (users[0].is_banned) {
      return res.status(403).json({ error: 'Your account has been banned. Contact support for assistance.' });
    }

    res.json({
      user: users[0],
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error during login', details: error.message });
  }
});

// Update sweet by ID
app.put('/api/sweets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sweet_name, category, weight, flavor, location, shop_address, price, type, sold, image
    } = req.body;

    if (!sweet_name || !category || !weight || !location || !shop_address || !price || !type || sold === undefined || !image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await pool.execute(
      'UPDATE sweets SET sweet_name = ?, category = ?, weight = ?, flavor = ?, location = ?, shop_address = ?, price = ?, type = ?, sold = ?, image = ? WHERE id = ?',
      [sweet_name, category, weight, flavor, location, shop_address, price, type, sold, image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Sweet with ID ${id} not found` });
    }

    res.json({ message: 'Sweet updated successfully' });
  } catch (error) {
    console.error('Error updating sweet:', error);
    res.status(500).json({ error: 'Error updating sweet', details: error.message });
  }
});

// Delete sweet by ID
app.delete('/api/sweets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM sweets WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Sweet with ID ${id} not found` });
    }

    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    console.error('Error deleting sweet:', error);
    res.status(500).json({ error: 'Error deleting sweet', details: error.message });
  }
});

// Add new sweet at /addsweet endpoint
app.post('/api/addsweet', async (req, res) => {
  try {
    const {
      sweet_name, category, weight, flavor, location, shop_address, price, type, sold, image
    } = req.body;

    if (!sweet_name || !category || !weight || !location || !shop_address || !price || !type || sold === undefined || !image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await pool.execute(
      'INSERT INTO sweets (sweet_name, category, weight, flavor, location, shop_address, price, type, sold, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sweet_name, category, weight, flavor, location, shop_address, price, type, sold, image]
    );

    console.log('Sweet added successfully:', result);
    res.status(201).json({ message: 'Sweet added successfully', sweetId: result.insertId });
  } catch (error) {
    console.error('Error adding sweet:', error);
    res.status(500).json({ error: 'Error adding sweet', details: error.message });
  }
});

// ============================================
// User Authentication Endpoints
// ============================================

// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const [result] = await pool.execute(
      'INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)',
      [email, password, full_name]
    );

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId,
      full_name: full_name
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Error during registration', details: error.message });
  }
});

// User login
app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Check if email is banned
    const [bannedCheck] = await pool.execute(
      'SELECT id FROM banned_emails WHERE email = ?',
      [email]
    );

    if (bannedCheck.length > 0) {
      return res.status(403).json({ error: 'This email has been banned. Contact support for assistance.' });
    }

    const [rows] = await pool.execute(
      'SELECT id, email, full_name, is_banned FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (rows[0].is_banned) {
      return res.status(403).json({ error: 'Your account has been banned. Contact support for assistance.' });
    }

    res.json({
      id: rows[0].id,
      email: rows[0].email,
      full_name: rows[0].full_name
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error during login', details: error.message });
  }
});

// ============================================
// Order Management Endpoints
// ============================================

// Create new order
app.post('/api/orders', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { user_id, total_amount, delivery_address, items } = req.body;

    if (!user_id || !total_amount || !delivery_address || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await connection.beginTransaction();

    // Validate and decrease stock for each item
    for (const item of items) {
      const [stockCheck] = await connection.execute(
        'SELECT stock_quantity FROM sweets WHERE id = ?',
        [item.sweet_id]
      );

      if (stockCheck.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: `Sweet with ID ${item.sweet_id} not found` });
      }

      const currentStock = stockCheck[0].stock_quantity || 0;
      if (currentStock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          error: `Insufficient stock for sweet ID ${item.sweet_id}. Available: ${currentStock}, Requested: ${item.quantity}`
        });
      }
    }

    // Calculate total if not provided
    const calculatedTotal = total_amount || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, delivery_address, status) VALUES (?, ?, ?, ?)',
      [user_id, calculatedTotal, delivery_address, 'pending']
    );

    const orderId = orderResult.insertId;

    // Insert order items and update stock
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, sweet_id, quantity, price_per_unit, subtotal, status) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.sweet_id, item.quantity, item.price, item.price * item.quantity, 'pending']
      );

      // Decrease stock
      await connection.execute(
        'UPDATE sweets SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.sweet_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: 'Order created successfully',
      orderId: orderId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order', details: error.message });
  } finally {
    connection.release();
  }
});

// Get orders for a specific user
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Error fetching orders', details: error.message });
  }
});

// Get single order with items
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await pool.execute(
      'SELECT o.*, u.full_name, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?',
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [items] = await pool.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    res.json({
      ...orders[0],
      items: items
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order', details: error.message });
  }
});

// Get all orders (admin)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const [orders] = await pool.execute(
      'SELECT o.*, u.full_name, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
    );

    for (let order of orders) {
      const [items] = await pool.execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Error fetching orders', details: error.message });
  }
});

// Update order status
app.put('/api/orders/:orderId/status', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    await connection.beginTransaction();

    const [result] = await connection.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    // Cascade status to all items when order status changes
    await connection.execute(
      'UPDATE order_items SET status = ? WHERE order_id = ?',
      [status, orderId]
    );

    await connection.commit();

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status', details: error.message });
  } finally {
    connection.release();
  }
});

// Update order item status (per-sweet delivery status)
app.put('/api/order-items/:itemId/status', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const [result] = await pool.execute(
      'UPDATE order_items SET status = ? WHERE id = ?',
      [status, itemId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    res.json({ message: 'Order item status updated successfully' });
  } catch (error) {
    console.error('Error updating order item status:', error);
    res.status(500).json({ error: 'Error updating order item status', details: error.message });
  }
});

// Get all orders with sweet location info (admin)
app.get('/api/admin/orders/detailed', async (req, res) => {
  try {
    const [orders] = await pool.execute(
      'SELECT o.*, u.full_name, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
    );

    for (let order of orders) {
      const [items] = await pool.execute(
        `SELECT oi.*, s.location 
         FROM order_items oi 
         JOIN sweets s ON oi.sweet_id = s.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching detailed orders:', error);
    res.status(500).json({ error: 'Error fetching orders', details: error.message });
  }
});

// Update sweet stock
app.put('/api/sweets/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    if (stock_quantity === undefined || stock_quantity < 0) {
      return res.status(400).json({ error: 'Invalid stock quantity' });
    }

    const [result] = await pool.execute(
      'UPDATE sweets SET stock_quantity = ? WHERE id = ?',
      [stock_quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json({ message: 'Stock updated successfully', stock_quantity });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Error updating stock', details: error.message });
  }
});

// ============================================
// User Management Endpoints (Admin)
// ============================================

// Get all users
app.get('/api/admin/users', async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, email, full_name, is_banned, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users', details: error.message });
  }
});

// Create new user (Admin)
app.post('/api/admin/users', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const [result] = await pool.execute(
      'INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)',
      [email, password, full_name]
    );

    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
});

// Delete user
app.delete('/api/admin/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user', details: error.message });
  }
});

// Toggle user ban status
app.put('/api/admin/users/:userId/ban', async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_banned } = req.body;

    // Get user email first
    const [users] = await pool.execute(
      'SELECT email FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userEmail = users[0].email;

    // Update user ban status
    await pool.execute(
      'UPDATE users SET is_banned = ? WHERE id = ?',
      [is_banned, userId]
    );

    // Sync with banned_emails table
    if (is_banned) {
      // Add to banned_emails if banning
      await pool.execute(
        'INSERT IGNORE INTO banned_emails (email, reason, banned_by) VALUES (?, ?, ?)',
        [userEmail, 'Banned by admin from Users tab', 'Admin']
      );
    } else {
      // Remove from banned_emails if unbanning
      await pool.execute(
        'DELETE FROM banned_emails WHERE email = ?',
        [userEmail]
      );
    }

    res.json({ message: `User ${is_banned ? 'banned' : 'unbanned'} successfully` });
  } catch (error) {
    console.error('Error updating user ban status:', error);
    res.status(500).json({ error: 'Error updating ban status', details: error.message });
  }
});

// ============================================
// Banned Emails Management (Admin)
// ============================================

// Get all banned emails
app.get('/api/admin/banned-emails', async (req, res) => {
  try {
    const [bannedEmails] = await pool.execute(
      'SELECT * FROM banned_emails ORDER BY created_at DESC'
    );
    res.json(bannedEmails);
  } catch (error) {
    console.error('Error fetching banned emails:', error);
    res.status(500).json({ error: 'Error fetching banned emails', details: error.message });
  }
});

// Ban an email
app.post('/api/admin/banned-emails', async (req, res) => {
  try {
    const { email, reason, banned_by } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const [existingBan] = await pool.execute(
      'SELECT id FROM banned_emails WHERE email = ?',
      [email]
    );

    if (existingBan.length > 0) {
      return res.status(409).json({ error: 'Email is already banned' });
    }

    const [result] = await pool.execute(
      'INSERT INTO banned_emails (email, reason, banned_by) VALUES (?, ?, ?)',
      [email, reason || null, banned_by || 'Admin']
    );

    // Also ban the user if they exist
    await pool.execute(
      'UPDATE users SET is_banned = TRUE WHERE email = ?',
      [email]
    );

    res.status(201).json({
      message: 'Email banned successfully',
      banId: result.insertId
    });
  } catch (error) {
    console.error('Error banning email:', error);
    res.status(500).json({ error: 'Error banning email', details: error.message });
  }
});

// Unban an email
app.delete('/api/admin/banned-emails/:banId', async (req, res) => {
  try {
    const { banId } = req.params;

    // Get the email before deleting
    const [banned] = await pool.execute(
      'SELECT email FROM banned_emails WHERE id = ?',
      [banId]
    );

    if (banned.length === 0) {
      return res.status(404).json({ error: 'Ban record not found' });
    }

    const email = banned[0].email;

    // Remove from banned_emails
    await pool.execute(
      'DELETE FROM banned_emails WHERE id = ?',
      [banId]
    );

    // Unban the user if they exist
    await pool.execute(
      'UPDATE users SET is_banned = FALSE WHERE email = ?',
      [email]
    );

    res.json({ message: 'Email unbanned successfully' });
  } catch (error) {
    console.error('Error unb anning email:', error);
    res.status(500).json({ error: 'Error unbanning email', details: error.message });
  }
});

// Start Vite dev server
const vite = await createServer({
  server: { middlewareMode: true }
});
app.use(vite.middlewares);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
