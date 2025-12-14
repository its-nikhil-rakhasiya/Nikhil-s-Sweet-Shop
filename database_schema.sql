-- ============================================
-- Sweet Shop Database Schema (UPDATED & FIXED)
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS banned_emails;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS contact_form;
DROP TABLE IF EXISTS sweets;
DROP TABLE IF EXISTS admins;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Admins Table
-- ============================================
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO admins (username, email, password) VALUES
('admin', 'admin@gmail.com', 'admin');

-- ============================================
-- Sweets Table
-- ============================================
CREATE TABLE sweets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sweet_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  weight INT NOT NULL,
  flavor VARCHAR(100),
  location VARCHAR(100) NOT NULL,
  shop_address VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  sold BOOLEAN DEFAULT FALSE,
  image TEXT,
  stock_quantity INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_category (category),
  INDEX idx_location (location),
  INDEX idx_sold (sold)
) ENGINE=InnoDB;

INSERT INTO sweets
(sweet_name, category, weight, flavor, location, shop_address, price, type, image, stock_quantity)
VALUES
('Kaju Katli', 'Traditional', 500, 'Cashew', 'Mumbai', 'Laxmi Sweets, Dadar West', 450, 'Packaged',
'https://images.unsplash.com/photo-1699708263762-00ca477760bd', 50),

('Rasgulla', 'Traditional', 1000, 'Sweet', 'Kolkata', 'KC Das Sweets, Park Street', 350, 'Packaged',
'https://images.unsplash.com/photo-1714799263412-2e0c1f875959', 75),

('Gulab Jamun', 'Traditional', 500, 'Rose', 'Delhi', 'Haldiram, Connaught Place', 280, 'Packaged',
'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12', 100),

('Jalebi', 'Traditional', 250, 'Sweet', 'Jaipur', 'Old Jaipur Sweets', 180, 'Bulk',
'https://images.unsplash.com/photo-1622715395476-3dbcd161df05', 60),

('Barfi', 'Traditional', 500, 'Milk', 'Pune', 'Chitale Bandhu', 380, 'Packaged',
'https://images.unsplash.com/photo-1758910536889-43ce7b3199fd', 80),

('Ladoo', 'Traditional', 500, 'Besan', 'Ahmedabad', 'Kansar Gujarati', 250, 'Packaged',
'https://images.unsplash.com/photo-1605194000384-439c3ced8d15', 90),

('Rasmalai', 'Traditional', 500, 'Saffron', 'Hyderabad', 'Karachi Bakery', 420, 'Packaged',
'https://images.unsplash.com/photo-1694402594431-23c594be1745', 55),

('Chocolate Barfi', 'Fusion', 500, 'Chocolate', 'Mumbai', 'Laxmi Sweets', 480, 'Packaged',
'https://images.unsplash.com/photo-1699708263762-00ca477760bd', 40);

-- ============================================
-- Contact Form Table
-- ============================================
CREATE TABLE contact_form (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (email, password, full_name) VALUES
('nikhil@gmail.com', 'nikhil', 'Nikhil'),
('rahul@gmail.com', 'rahul', 'Rahul');

-- ============================================
-- Banned Emails Table
-- ============================================
CREATE TABLE banned_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  reason TEXT,
  banned_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Orders Table
-- ============================================
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address TEXT NOT NULL,
  status ENUM('pending','delivered','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO orders (user_id, total_amount, delivery_address, status) VALUES
(1, 900.00, 'Andheri West, Mumbai', 'pending'),
(1, 1230.00, 'Andheri West, Mumbai', 'delivered'),
(2, 650.00, 'Koramangala, Bangalore', 'pending');

-- ============================================
-- Order Items Table
-- ============================================
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  sweet_id INT NOT NULL,
  quantity INT NOT NULL,
  price_per_unit DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (sweet_id) REFERENCES sweets(id)
);

INSERT INTO order_items
(order_id, sweet_id, quantity, price_per_unit, subtotal)
VALUES
(1, 1, 2, 450.00, 900.00),
(2, 1, 1, 450.00, 450.00),
(2, 3, 1, 280.00, 280.00),
(2, 7, 1, 420.00, 420.00),
(3, 8, 1, 480.00, 480.00);

-- ============================================
-- Validation Queries
-- ============================================
SELECT 'DATABASE CREATED SUCCESSFULLY' AS STATUS;
SELECT COUNT(*) AS total_sweets FROM sweets;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_orders FROM orders;
SELECT COUNT(*) AS pending_orders FROM orders WHERE status='pending';
SELECT COUNT(*) AS delivered_orders FROM orders WHERE status='delivered';
