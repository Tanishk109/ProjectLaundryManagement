# MongoDB Setup Guide

This project has been migrated from MySQL to MongoDB. Follow these steps to set up your MongoDB database.

## Prerequisites

1. **MongoDB Installation**
   - Install MongoDB Community Server: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

2. **Node.js Dependencies**
   - Mongoose is already installed in `package.json`

## Configuration

### Option 1: Local MongoDB

1. Start your local MongoDB server:
   ```bash
   # macOS (if installed via Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```

2. Create a `.env.local` file in the project root:
   ```env
   MONGODB_URI=mongodb://localhost:27017/laundry_management
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Create a `.env.local` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/laundry_management?retryWrites=true&w=majority
   ```

## Database Models

The following Mongoose models have been created:

- **User** (`lib/models/User.ts`) - Users (admin, customer, employee)
- **Machine** (`lib/models/Machine.ts`) - Laundry machines
- **Order** (`lib/models/Order.ts`) - Customer orders
- **LaundryLog** (`lib/models/LaundryLog.ts`) - Order activity logs
- **Notification** (`lib/models/Notification.ts`) - User notifications
- **Feedback** (`lib/models/Feedback.ts`) - Customer feedback

## Seeding Initial Data (Optional)

You can create a seed script to populate initial data. Here's a sample seed script:

```javascript
// scripts/seed.js
const mongoose = require('mongoose');
const User = require('../lib/models/User').default;
const Machine = require('../lib/models/Machine').default;

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry_management');
  
  // Seed users
  const admin = await User.create({
    email: 'admin@laundry.com',
    password: 'admin123',
    full_name: 'Admin User',
    role: 'admin',
    phone: '555-0001'
  });

  const customer = await User.create({
    email: 'john@student.com',
    password: 'pass123',
    full_name: 'John Smith',
    role: 'customer',
    phone: '555-0002'
  });

  // Seed machines
  await Machine.create([
    { machine_name: 'Washer A1', machine_type: 'washer', status: 'available', capacity_kg: 8.5, location: 'Floor 1 - Room 101' },
    { machine_name: 'Dryer A1', machine_type: 'dryer', status: 'available', capacity_kg: 6.0, location: 'Floor 1 - Room 102' }
  ]);

  console.log('Database seeded successfully!');
  await mongoose.connection.close();
}

seed();
```

## API Routes Updated

All API routes have been migrated to use MongoDB:

- ✅ `/api/auth/login` - User authentication
- ✅ `/api/users` - User management
- ✅ `/api/machines` - Machine management
- ✅ `/api/orders` - Order management
- ✅ `/api/notifications` - Notifications
- ✅ `/api/feedback` - Feedback system
- ✅ `/api/stats` - Statistics

## Testing the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. The MongoDB connection will be established automatically when the first API route is called.

3. Check the console for any connection errors.

## Migration Notes

### Key Changes from MySQL:

1. **Connection**: Uses Mongoose instead of mysql2
2. **Queries**: Uses Mongoose methods instead of SQL
3. **IDs**: Uses MongoDB ObjectIds instead of auto-increment integers
4. **Relations**: Uses references and population instead of JOINs
5. **Schema**: Defined using Mongoose schemas instead of SQL CREATE TABLE

### Field Mappings:

- `user_id` → `_id` (ObjectId)
- `machine_id` → `_id` (ObjectId) 
- `order_id` → `order_id` (String, still used for tracking)
- `customer_id` → `customer_id` (String, still used for tracking)

## Troubleshooting

### Connection Issues

If you see connection errors:
1. Verify MongoDB is running: `mongosh` or `mongo`
2. Check your `MONGODB_URI` in `.env.local`
3. For Atlas: Ensure your IP is whitelisted

### Model Errors

If models aren't found:
1. Clear Next.js cache: `rm -rf .next`
2. Restart the dev server

## Next Steps

1. Set up your MongoDB database (local or Atlas)
2. Create `.env.local` with your `MONGODB_URI`
3. Start the dev server: `npm run dev`
4. Test the API endpoints

For production, make sure to:
- Use environment variables for sensitive data
- Set up proper MongoDB authentication
- Configure connection pooling
- Add error handling and logging

