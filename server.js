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

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute(
      'SELECT id, username FROM admins WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length > 0) {
      res.json({ id: rows[0].id, username: rows[0].username });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
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

// User login endpoint
app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const [rows] = await pool.execute(
      'SELECT id, email, full_name FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length > 0) {
      res.json({
        id: rows[0].id,
        email: rows[0].email,
        full_name: rows[0].full_name
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during user login:', error);
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

    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, delivery_address, status) VALUES (?, ?, ?, ?)',
      [user_id, total_amount, delivery_address, 'pending']
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, sweet_id, sweet_name, quantity, price_per_unit, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.sweet_id, item.sweet_name, item.quantity, item.price_per_unit, item.subtotal]
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
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status', details: error.message });
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
