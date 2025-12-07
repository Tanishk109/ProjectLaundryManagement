-- Run this in MySQL Workbench or MySQL command line
-- Make sure you're connected to the laundry_management database

USE laundry_management;

-- Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(10) NOT NULL,
    order_id VARCHAR(12),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    category ENUM('service', 'machine', 'employee', 'general') DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(customer_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_feedback_customer ON feedback(customer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_order ON feedback(order_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);


