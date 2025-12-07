# Database Documentation

## MongoDB Setup

This project uses **MongoDB** (via MongoDB Atlas) instead of MySQL.

### Connection String

The MongoDB connection string is configured in `.env.local`:

```
MONGODB_URI=mongodb+srv://Laundry_Management:8585Ritz2015@cluster0.axlnobz.mongodb.net/laundry_management?retryWrites=true&w=majority
```

### Schema Documentation

- **MongoDB Schema**: See `MONGODB_SCHEMA.md` for detailed collection schemas
- **Legacy SQL Files**: The `.sql` files are kept for reference only (not used)

### Setting Up the Database

1. **Automatic**: Collections are created automatically when you first insert data
2. **Seed Data**: Run `npm run seed` to populate initial data
3. **Manual**: Use Mongoose models in `lib/models/` to create documents

### Legacy SQL Files (Reference Only)

- `laundry_system.sql` - Original MySQL schema (for reference)
- `add_feedback_table.sql` - Original MySQL feedback table (for reference)

These files are **not executed** - they're kept for documentation purposes only.

### MongoDB Models

All models are in `lib/models/`:
- `User.ts` - Users collection
- `Machine.ts` - Machines collection  
- `Order.ts` - Orders collection
- `LaundryLog.ts` - Laundry logs collection
- `Notification.ts` - Notifications collection
- `Feedback.ts` - Feedback collection

### Quick Start

1. Ensure `.env.local` has your MongoDB connection string
2. Run `npm run seed` to populate initial data
3. Start the app: `npm run dev`

The database will be automatically created and collections will be initialized on first use.

