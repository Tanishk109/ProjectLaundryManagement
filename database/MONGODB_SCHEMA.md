# MongoDB Schema Documentation

This document describes the MongoDB collections (equivalent to SQL tables) used in the Laundry Management System.

## Collections Overview

### 1. users
**Description**: Stores all users (admin, customers, employees)

**Schema** (Mongoose):
```javascript
{
  customer_id: String (unique, sparse),  // Auto-generated: CUSxxx for customers, EMPxxx for employees
  email: String (unique, required),
  password: String (required),
  full_name: String (required),
  role: Enum ['admin', 'customer', 'employee'] (required),
  phone: String,
  created_at: Date (auto),
  updated_at: Date (auto)
}
```

**MongoDB Equivalent**:
- No explicit CREATE TABLE needed - collections are created automatically
- Indexes: `email` (unique), `customer_id` (unique, sparse)
- Auto-generation of `customer_id` handled in Mongoose pre-save hook

---

### 2. machines
**Description**: Stores laundry machines (washers and dryers)

**Schema** (Mongoose):
```javascript
{
  machine_name: String (required),
  machine_type: Enum ['washer', 'dryer'] (required),
  status: Enum ['available', 'in-use', 'maintenance'] (default: 'available'),
  capacity_kg: Number,
  location: String,
  created_at: Date (auto),
  updated_at: Date (auto)
}
```

**MongoDB Equivalent**:
- Collection created automatically on first document insert
- No foreign keys needed (MongoDB is schema-less)

---

### 3. orders
**Description**: Stores customer orders/bookings

**Schema** (Mongoose):
```javascript
{
  order_id: String (unique, required),  // Auto-generated: ORDxxxxx
  customer_id: String (required),  // References users.customer_id
  machine_id: ObjectId (ref: 'Machine'),  // References machines._id
  weight_kg: Number,
  cycle_type: String (default: 'Normal'),
  temp_setting: String (default: 'Warm'),
  spin_speed: Number (default: 1200),
  status: Enum ['pending', 'in-progress', 'washing', 'drying', 'ready', 'completed', 'cancelled'] (default: 'pending'),
  notes: String,
  estimated_completion: Date,
  actual_completion: Date,
  created_at: Date (auto),
  updated_at: Date (auto)
}
```

**MongoDB Equivalent**:
- `order_id` is indexed (unique)
- `machine_id` uses MongoDB ObjectId reference (not foreign key constraint)
- Auto-generation of `order_id` handled in Mongoose pre-save hook

---

### 4. laundry_logs
**Description**: Stores detailed activity logs for orders

**Schema** (Mongoose):
```javascript
{
  order_id: String (required),  // References orders.order_id
  employee_id: ObjectId (ref: 'User'),  // References users._id
  action: String,
  notes: String,
  created_at: Date (auto)
}
```

**MongoDB Equivalent**:
- No foreign key constraints (MongoDB doesn't enforce referential integrity)
- Relationships maintained through application logic

---

### 5. notifications
**Description**: Stores user notifications

**Schema** (Mongoose):
```javascript
{
  user_id: ObjectId (ref: 'User', required),  // References users._id
  order_id: String,  // References orders.order_id
  message: String (required),
  type: Enum ['alert', 'reminder', 'complete', 'error', 'info'] (default: 'alert'),
  is_read: Boolean (default: false),
  created_at: Date (auto)
}
```

**MongoDB Equivalent**:
- `user_id` uses MongoDB ObjectId reference
- No foreign key constraints

---

### 6. feedback
**Description**: Stores customer feedback and ratings

**Schema** (Mongoose):
```javascript
{
  customer_id: String (required),  // References users.customer_id
  order_id: String,  // References orders.order_id
  rating: Number (required, min: 1, max: 5),
  comment: String,
  category: Enum ['service', 'machine', 'employee', 'general'] (default: 'general'),
  created_at: Date (auto),
  updated_at: Date (auto)
}
```

**MongoDB Equivalent**:
- No explicit table creation needed
- Validation handled by Mongoose schema

---

## Key Differences from SQL

### 1. No Explicit Table Creation
- Collections are created automatically when first document is inserted
- No `CREATE TABLE` statements needed

### 2. No Foreign Key Constraints
- MongoDB doesn't enforce referential integrity
- Relationships maintained through application logic
- Use `populate()` for joining related documents

### 3. Auto-increment IDs
- MongoDB uses `ObjectId` (_id) instead of auto-increment integers
- Custom IDs like `customer_id` and `order_id` are generated in application code (Mongoose hooks)

### 4. Indexes
- Created via Mongoose schema options or `createIndex()`
- Example: `email: { unique: true }` creates unique index

### 5. Data Types
- More flexible than SQL
- Can store nested objects and arrays
- No strict type enforcement (handled by Mongoose)

## MongoDB Queries vs SQL

### SQL:
```sql
SELECT * FROM users WHERE role = 'customer';
```

### MongoDB (Mongoose):
```javascript
await User.find({ role: 'customer' });
```

### SQL JOIN:
```sql
SELECT o.*, u.full_name 
FROM orders o 
JOIN users u ON o.customer_id = u.customer_id;
```

### MongoDB (Mongoose):
```javascript
const orders = await Order.find({})
  .populate('machine_id', 'machine_name');
// Then manually join customer data
const users = await User.find({ customer_id: { $in: customerIds } });
```

## Seeding Data

Use the seed script instead of SQL INSERT statements:

```bash
npm run seed
```

Or use Mongoose directly:
```javascript
await User.create({
  email: 'admin@laundry.com',
  password: 'admin123',
  full_name: 'Admin User',
  role: 'admin'
});
```

## Migration Notes

- All SQL tables have been converted to Mongoose models
- All API routes use MongoDB/Mongoose instead of SQL
- The seed script (`scripts/seed-mongodb.js`) replaces SQL INSERT statements
- No SQL scripts needed - everything is handled by Mongoose

