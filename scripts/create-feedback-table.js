const mysql = require('mysql2/promise');

async function createFeedbackTable() {
  let connection;
  try {
    // Use same defaults as lib/db.ts
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'laundry_management',
    });

    console.log('Connected to MySQL database');

    // Create feedback table
    await connection.execute(`
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
      )
    `);

    console.log('✓ Feedback table created successfully');

    // Create indexes
    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_feedback_customer ON feedback(customer_id)
    `);
    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_feedback_order ON feedback(order_id)
    `);
    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating)
    `);

    console.log('✓ Indexes created successfully');
    console.log('Feedback table setup complete!');

  } catch (error) {
    console.error('Error creating feedback table:', error.message);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('\n⚠️  Error: Referenced tables (users or orders) do not exist.');
      console.error('Please make sure you have run the main database schema first.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createFeedbackTable();

