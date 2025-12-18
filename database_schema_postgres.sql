-- PostgreSQL Database Schema with Cleanup and Sequence Resets

-- Cleanup existing tables (reverse order of dependencies)
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "sweets" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "banned_emails" CASCADE;
DROP TABLE IF EXISTS "admins" CASCADE;
DROP TYPE IF EXISTS "order_status" CASCADE;

-- Enable UUID extension if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------

--
-- Table structure for table "admins"
--

CREATE TABLE "admins" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(100) NOT NULL UNIQUE,
  "email" VARCHAR(100) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "admins"
--

INSERT INTO "admins" ("id", "username", "email", "password", "created_at", "updated_at") VALUES
(1, 'admin', 'admin@gmail.com', 'admin123', '2025-12-14 05:27:48', '2025-12-14 11:45:17');

-- Reset sequence for admins
SELECT setval('admins_id_seq', (SELECT MAX(id) FROM "admins"));

-- --------------------------------------------------------

--
-- Table structure for table "banned_emails"
--

CREATE TABLE "banned_emails" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "reason" TEXT DEFAULT NULL,
  "banned_by" VARCHAR(100) DEFAULT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "banned_emails"
--

INSERT INTO "banned_emails" ("id", "email", "reason", "banned_by", "created_at") VALUES
(1, 'rahul@gmail.com', 'Banned by admin from Users tab', 'Admin', '2025-12-14 11:46:05');

-- Reset sequence for banned_emails
SELECT setval('banned_emails_id_seq', (SELECT MAX(id) FROM "banned_emails"));

-- --------------------------------------------------------

--
-- Table structure for table "users"
--

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "full_name" VARCHAR(255) NOT NULL,
  "is_banned" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "users"
--

INSERT INTO "users" ("id", "email", "password", "full_name", "is_banned", "created_at", "updated_at") VALUES
(1, 'nikhil@gmail.com', 'nikhil', 'Nikhil', FALSE, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(2, 'rahul@gmail.com', 'rahul', 'Rahul', TRUE, '2025-12-14 05:27:48', '2025-12-14 11:46:05');

-- Reset sequence for users
SELECT setval('users_id_seq', (SELECT MAX(id) FROM "users"));

-- --------------------------------------------------------

--
-- Table structure for table "orders"
--

CREATE TYPE order_status AS ENUM ('pending', 'delivered', 'cancelled');

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "total_amount" DECIMAL(10,2) NOT NULL,
  "delivery_address" TEXT NOT NULL,
  "status" VARCHAR(20) DEFAULT 'pending', -- Using varchar for simplicity or cast enum
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "orders"
--

INSERT INTO "orders" ("id", "user_id", "total_amount", "delivery_address", "status", "created_at", "updated_at") VALUES
(1, 1, 900.00, 'Andheri West, Mumbai', 'pending', '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(2, 1, 1230.00, 'Andheri West, Mumbai', 'delivered', '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(3, 2, 650.00, 'Koramangala, Bangalore', 'pending', '2025-12-14 05:27:48', '2025-12-14 05:27:48');

-- Reset sequence for orders
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM "orders"));

-- --------------------------------------------------------

--
-- Table structure for table "sweets"
--

CREATE TABLE "sweets" (
  "id" SERIAL PRIMARY KEY,
  "sweet_name" VARCHAR(100) NOT NULL,
  "category" VARCHAR(50) NOT NULL,
  "weight" INTEGER NOT NULL,
  "flavor" VARCHAR(100) DEFAULT NULL,
  "location" VARCHAR(100) NOT NULL,
  "shop_address" VARCHAR(255) NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "type" VARCHAR(50) NOT NULL,
  "sold" BOOLEAN DEFAULT FALSE,
  "image" TEXT DEFAULT NULL,
  "stock_quantity" INTEGER DEFAULT 100,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_category" ON "sweets" ("category");
CREATE INDEX "idx_location" ON "sweets" ("location");

--
-- Dumping data for table "sweets"
--

INSERT INTO "sweets" ("id", "sweet_name", "category", "weight", "flavor", "location", "shop_address", "price", "type", "sold", "image", "stock_quantity", "created_at", "updated_at") VALUES
(1, 'Kaju Katli', 'Traditional', 500, 'Cashew', 'Mumbai', 'Laxmi Sweets, Dadar West', 450.00, 'Packaged', FALSE, 'https://images.unsplash.com/photo-1699708263762-00ca477760bd', 50, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(2, 'Rasgulla', 'Traditional', 1000, 'Sweet', 'Kolkata', 'KC Das Sweets, Park Street', 350.00, 'Packaged', TRUE, 'https://images.unsplash.com/photo-1714799263412-2e0c1f875959', 0, '2025-12-14 05:27:48', '2025-12-14 11:21:23'),
(3, 'Gulab Jamun', 'Traditional', 500, 'Rose', 'Delhi', 'Haldiram, Connaught Place', 280.00, 'Packaged', FALSE, 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12', 100, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(4, 'Jalebi', 'Traditional', 250, 'Sweet', 'Jaipur', 'Old Jaipur Sweets', 180.00, 'Bulk', FALSE, 'https://images.unsplash.com/photo-1622715395476-3dbcd161df05', 60, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(5, 'Barfi', 'Traditional', 500, 'Milk', 'Pune', 'Chitale Bandhu', 380.00, 'Packaged', FALSE, 'https://images.unsplash.com/photo-1758910536889-43ce7b3199fd', 80, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(6, 'Ladoo', 'Traditional', 500, 'Besan', 'Ahmedabad', 'Kansar Gujarati', 250.00, 'Packaged', FALSE, 'https://images.unsplash.com/photo-1605194000384-439c3ced8d15', 90, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(7, 'Rasmalai', 'Traditional', 500, 'Saffron', 'Hyderabad', 'Karachi Bakery', 420.00, 'Packaged', FALSE, 'https://images.unsplash.com/photo-1694402594431-23c594be1745', 55, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(8, 'Chocolate Barfi', 'Fusion', 500, 'Chocolate', 'Mumbai', 'Laxmi Sweets', 480.00, 'Packaged', TRUE, 'https://images.unsplash.com/photo-1699708263762-00ca477760bd', 0, '2025-12-14 05:27:48', '2025-12-14 11:21:29');

-- Reset sequence for sweets
SELECT setval('sweets_id_seq', (SELECT MAX(id) FROM "sweets"));

-- --------------------------------------------------------

--
-- Table structure for table "order_items"
--

CREATE TABLE "order_items" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL REFERENCES "orders" ("id") ON DELETE CASCADE,
  "sweet_id" INTEGER NOT NULL REFERENCES "sweets" ("id"),
  "quantity" INTEGER NOT NULL,
  "price_per_unit" DECIMAL(10,2) NOT NULL,
  "subtotal" DECIMAL(10,2) NOT NULL,
  "status" VARCHAR(20) DEFAULT 'pending'
);

--
-- Dumping data for table "order_items"
--

INSERT INTO "order_items" ("id", "order_id", "sweet_id", "quantity", "price_per_unit", "subtotal") VALUES
(1, 1, 1, 2, 450.00, 900.00),
(2, 2, 1, 1, 450.00, 450.00),
(3, 2, 3, 1, 280.00, 280.00),
(4, 2, 7, 1, 420.00, 420.00),
(5, 3, 8, 1, 480.00, 480.00);

-- Reset sequence for order_items
SELECT setval('order_items_id_seq', (SELECT MAX(id) FROM "order_items"));

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON "admins" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON "orders" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sweets_updated_at BEFORE UPDATE ON "sweets" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
