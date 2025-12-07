# Quick Start Guide - MongoDB Setup

## 🚀 Quick Setup (3 Steps)

### 1. Install MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Or use MongoDB Atlas (cloud) - no installation needed
# Visit: https://www.mongodb.com/cloud/atlas
```

### 2. Configure Connection

Create a `.env.local` file in the project root:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/laundry_management

# OR for MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/laundry_management
```

### 3. Seed Database (Optional)

```bash
npm run seed
```

This will create:
- Admin user: `admin@laundry.com` / `admin123`
- Customer: `john@student.com` / `pass123`
- Employee: `emp@laundry.com` / `emp123`
- Sample machines and orders

### 4. Start Development Server

```bash
npm run dev
```

## ✅ What's Been Done

- ✅ Mongoose installed and configured
- ✅ MongoDB connection setup (`lib/db.ts`)
- ✅ All Mongoose models created:
  - User, Machine, Order, LaundryLog, Notification, Feedback
- ✅ All API routes migrated to MongoDB:
  - `/api/auth/login`
  - `/api/users`
  - `/api/machines`
  - `/api/orders`
  - `/api/notifications`
  - `/api/feedback`
  - `/api/stats`

## 📁 Project Structure

```
lib/
  ├── db.ts                    # MongoDB connection
  └── models/
      ├── User.ts              # User model
      ├── Machine.ts           # Machine model
      ├── Order.ts             # Order model
      ├── LaundryLog.ts        # Log model
      ├── Notification.ts      # Notification model
      └── Feedback.ts          # Feedback model

app/api/                       # All routes use MongoDB
scripts/
  └── seed-mongodb.js         # Database seed script
```

## 🔍 Testing

1. Start MongoDB (if local)
2. Create `.env.local` with `MONGODB_URI`
3. Run `npm run seed` (optional)
4. Run `npm run dev`
5. Visit `http://localhost:3000`
6. Login with: `admin@laundry.com` / `admin123`

## 📝 Notes

- The database will be created automatically on first connection
- All models use Mongoose schemas with TypeScript types
- IDs are MongoDB ObjectIds (converted to strings for frontend)
- `customer_id` and `order_id` are still strings for tracking

## 🆘 Troubleshooting

**Connection Error?**
- Check MongoDB is running: `mongosh` or `mongo`
- Verify `MONGODB_URI` in `.env.local`
- For Atlas: Check IP whitelist

**Model Not Found?**
- Clear cache: `rm -rf .next`
- Restart dev server

**Seed Script Fails?**
- Make sure MongoDB is running
- Check `MONGODB_URI` is correct

