-- Laundry Management System Database
-- Run this script in MySQL Workbench to set up the database

-- Create Database
CREATE DATABASE IF NOT EXISTS laundry_management;
USE laundry_management;

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS laundry_logs;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS machines;
DROP TABLE IF EXISTS users;

-- Added customer_id unique field for tracking
-- Users Table with unique Customer ID
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(10) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer', 'employee') NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Machines Table
CREATE TABLE machines (
    machine_id INT PRIMARY KEY AUTO_INCREMENT,
    machine_name VARCHAR(100) NOT NULL,
    machine_type ENUM('washer', 'dryer') NOT NULL,
    status ENUM('available', 'in-use', 'maintenance') DEFAULT 'available',
    capacity_kg DECIMAL(5, 2),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- New Orders Table with unique order_id for tracking
-- Orders Table (replaces bookings - each order has unique ID)
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(12) UNIQUE NOT NULL,
    customer_id VARCHAR(10) NOT NULL,
    machine_id INT,
    weight_kg DECIMAL(5, 2),
    cycle_type VARCHAR(50) DEFAULT 'Normal',
    temp_setting VARCHAR(50) DEFAULT 'Warm',
    spin_speed INT DEFAULT 1200,
    status ENUM('pending', 'in-progress', 'washing', 'drying', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    estimated_completion DATETIME,
    actual_completion DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(customer_id),
    FOREIGN KEY (machine_id) REFERENCES machines(machine_id)
);

-- Laundry Logs Table (detailed cycle info)
CREATE TABLE laundry_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(12) NOT NULL,
    employee_id INT,
    action VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (employee_id) REFERENCES users(user_id)
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_id VARCHAR(12),
    message TEXT NOT NULL,
    type ENUM('alert', 'reminder', 'complete', 'error') DEFAULT 'alert',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Trigger to auto-generate customer_id for new customers
DELIMITER //
CREATE TRIGGER before_user_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.role = 'customer' AND NEW.customer_id IS NULL THEN
        SET NEW.customer_id = CONCAT('CUS', UPPER(SUBSTRING(MD5(RAND()), 1, 6)));
    END IF;
END//
DELIMITER ;

-- Trigger to auto-generate order_id for new orders
DELIMITER //
CREATE TRIGGER before_order_insert
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_id IS NULL OR NEW.order_id = '' THEN
        SET NEW.order_id = CONCAT('ORD', UPPER(SUBSTRING(MD5(RAND()), 1, 8)));
    END IF;
END//
DELIMITER ;

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert Users (password should be hashed in production)
INSERT INTO users (customer_id, email, password, full_name, role, phone) VALUES
(NULL, 'admin@laundry.com', 'admin123', 'Admin User', 'admin', '555-0001'),
('CUS7XK9M2', 'john@student.com', 'pass123', 'John Smith', 'customer', '555-0002'),
('CUS3AB8K1', 'jane@student.com', 'pass123', 'Jane Doe', 'customer', '555-0003'),
('CUSM5P2N7', 'mike@student.com', 'pass123', 'Mike Wilson', 'customer', '555-0006'),
(NULL, 'emp@laundry.com', 'emp123', 'Rajesh Kumar', 'employee', '555-0004'),
(NULL, 'emp2@laundry.com', 'emp123', 'Priya Sharma', 'employee', '555-0005');

-- Insert Machines
INSERT INTO machines (machine_name, machine_type, status, capacity_kg, location) VALUES
('Washer A1', 'washer', 'available', 8.5, 'Floor 1 - Room 101'),
('Washer A2', 'washer', 'in-use', 8.5, 'Floor 1 - Room 101'),
('Washer B1', 'washer', 'available', 7.0, 'Floor 2 - Room 201'),
('Washer B2', 'washer', 'available', 7.0, 'Floor 2 - Room 201'),
('Dryer A1', 'dryer', 'available', 6.0, 'Floor 1 - Room 102'),
('Dryer A2', 'dryer', 'maintenance', 6.0, 'Floor 1 - Room 102'),
('Dryer B1', 'dryer', 'available', 5.5, 'Floor 2 - Room 202'),
('Dryer B2', 'dryer', 'in-use', 5.5, 'Floor 2 - Room 202');

-- Insert Sample Orders
INSERT INTO orders (order_id, customer_id, machine_id, weight_kg, cycle_type, temp_setting, spin_speed, status, notes) VALUES
('ORDM5K8X2A', 'CUS7XK9M2', 2, 5.2, 'Normal', 'Warm', 1200, 'washing', 'Regular clothes'),
('ORDP3N7Y1B', 'CUS7XK9M2', 8, 3.5, 'Delicate', 'Cold', 800, 'drying', 'Delicate items'),
('ORDK9M2X5C', 'CUS3AB8K1', 1, 4.0, 'Heavy', 'Hot', 1400, 'pending', 'Bed sheets'),
('ORDW2A6N8D', 'CUS3AB8K1', NULL, 6.5, 'Normal', 'Warm', 1200, 'completed', 'Weekly laundry'),
('ORDJ4P8K2E', 'CUSM5P2N7', 3, 2.8, 'Quick', 'Cold', 1000, 'in-progress', 'Quick wash needed');

-- Insert Sample Logs
INSERT INTO laundry_logs (order_id, employee_id, action, notes) VALUES
('ORDM5K8X2A', 5, 'Started washing cycle', 'Machine A2 assigned'),
('ORDP3N7Y1B', 5, 'Moved to dryer', 'Dryer B2 assigned'),
('ORDW2A6N8D', 6, 'Order completed', 'Ready for pickup');

-- Insert Sample Notifications
INSERT INTO notifications (user_id, order_id, message, type, is_read) VALUES
(2, 'ORDM5K8X2A', 'Your laundry is currently being washed', 'alert', FALSE),
(2, 'ORDP3N7Y1B', 'Your laundry is now in the dryer', 'alert', FALSE),
(3, 'ORDW2A6N8D', 'Your laundry is ready for pickup!', 'complete', FALSE);

-- =====================================================
-- USEFUL QUERIES FOR TESTING
-- =====================================================

-- View all customers with their IDs
-- SELECT user_id, customer_id, full_name, email FROM users WHERE role = 'customer';

-- View all orders with customer names
-- SELECT o.order_id, o.customer_id, u.full_name, o.status, o.weight_kg, o.created_at 
-- FROM orders o 
-- JOIN users u ON o.customer_id = u.customer_id 
-- ORDER BY o.created_at DESC;

-- Track specific order
-- SELECT * FROM orders WHERE order_id = 'ORDM5K8X2A';

-- Get order history for customer
-- SELECT * FROM orders WHERE customer_id = 'CUS7XK9M2' ORDER BY created_at DESC;
