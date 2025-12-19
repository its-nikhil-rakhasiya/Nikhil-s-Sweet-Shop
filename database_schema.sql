SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Table structure for table `admins`
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `admins` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@gmail.com', 'admin123', '2025-12-14 05:27:48', '2025-12-14 11:45:17');

-- Table structure for table `banned_emails`
CREATE TABLE `banned_emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `reason` text DEFAULT NULL,
  `banned_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `banned_emails` (`id`, `email`, `reason`, `banned_by`, `created_at`) VALUES
(1, 'rahul@gmail.com', 'Banned by admin from Users tab', 'Admin', '2025-12-14 11:46:05');

-- Table structure for table `users`
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `is_banned` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `is_banned`, `created_at`, `updated_at`) VALUES
(1, 'nikhil@gmail.com', 'nikhil', 'Nikhil', 0, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(2, 'rahul@gmail.com', 'rahul', 'Rahul', 1, '2025-12-14 05:27:48', '2025-12-14 11:46:05');

-- Table structure for table `sweets`
CREATE TABLE `sweets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sweet_name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `weight` int(11) NOT NULL,
  `flavor` varchar(100) DEFAULT NULL,
  `location` varchar(100) NOT NULL,
  `shop_address` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `type` varchar(50) NOT NULL,
  `sold` tinyint(1) DEFAULT 0,
  `image` text DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT 100,
  `created_at?` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_location` (`location`),
  KEY `idx_sold` (`sold`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `sweets` (`id`, `sweet_name`, `category`, `weight`, `flavor`, `location`, `shop_address`, `price`, `type`, `sold`, `image`, `stock_quantity`, `created_at?`, `updated_at`) VALUES
(1, 'Kaju Katli', 'Traditional', 500, 'Cashew', 'Mumbai', 'Laxmi Sweets, Dadar West', 450.00, 'Packaged', 0, 'https://images.unsplash.com/photo-1699708263762-00ca477760bd', 50, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(2, 'Rasgulla', 'Traditional', 1000, 'Sweet', 'Kolkata', 'KC Das Sweets, Park Street', 350.00, 'Packaged', 1, 'https://images.unsplash.com/photo-1714799263412-2e0c1f875959', 0, '2025-12-14 05:27:48', '2025-12-14 11:21:23'),
(3, 'Gulab Jamun', 'Traditional', 500, 'Rose', 'Delhi', 'Haldiram, Connaught Place', 280.00, 'Packaged', 0, 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12', 100, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(4, 'Jalebi', 'Traditional', 250, 'Sweet', 'Jaipur', 'Old Jaipur Sweets', 180.00, 'Bulk', 0, 'https://images.unsplash.com/photo-1622715395476-3dbcd161df05', 60, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(5, 'Barfi', 'Traditional', 500, 'Milk', 'Pune', 'Chitale Bandhu', 380.00, 'Packaged', 0, 'https://images.unsplash.com/photo-1758910536889-43ce7b3199fd', 80, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(6, 'Ladoo', 'Traditional', 500, 'Besan', 'Ahmedabad', 'Kansar Gujarati', 250.00, 'Packaged', 0, 'https://images.unsplash.com/photo-1605194000384-439c3ced8d15', 90, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(7, 'Rasmalai', 'Traditional', 500, 'Saffron', 'Hyderabad', 'Karachi Bakery', 420.00, 'Packaged', 0, 'https://images.unsplash.com/photo-1694402594431-23c594be1745', 55, '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(8, 'Chocolate Barfi', 'Fusion', 500, 'Chocolate', 'Mumbai', 'Laxmi Sweets', 480.00, 'Packaged', 1, 'https://images.unsplash.com/photo-1699708263762-00ca477760bd', 0, '2025-12-14 05:27:48', '2025-12-14 11:21:29');

-- Table structure for table `orders`
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `delivery_address` text NOT NULL,
  `status` enum('pending','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `delivery_address`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 900.00, 'Andheri West, Mumbai', 'pending', '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(2, 1, 1230.00, 'Andheri West, Mumbai', 'delivered', '2025-12-14 05:27:48', '2025-12-14 05:27:48'),
(3, 2, 650.00, 'Koramangala, Bangalore', 'pending', '2025-12-14 05:27:48', '2025-12-14 05:27:48');

-- Table structure for table `order_items`
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `sweet_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_per_unit` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `sweet_id` (`sweet_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`sweet_id`) REFERENCES `sweets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `order_items` (`id`, `order_id`, `sweet_id`, `quantity`, `price_per_unit`, `subtotal`) VALUES
(1, 1, 1, 2, 450.00, 900.00),
(2, 2, 1, 1, 450.00, 450.00),
(3, 2, 3, 1, 280.00, 280.00),
(4, 2, 7, 1, 420.00, 420.00),
(5, 3, 8, 1, 480.00, 480.00);

COMMIT;
