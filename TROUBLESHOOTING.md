# Troubleshooting Guide - Login & Registration

## ✅ Fixed Issues

### 1. Enhanced Error Handling
- Added detailed console logging in login and registration routes
- Better error messages returned to frontend
- Connection status logging

### 2. Improved User Model
- Fixed pre-save hook to avoid circular references
- Better customer_id generation for customers and employees

### 3. Database Connection
- Improved connection caching
- Better error messages if connection fails

## 🧪 Testing Login & Registration

### Method 1: Use the Test Script

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **In another terminal, run the test:**
   ```bash
   npm run test-api
   ```

### Method 2: Manual Testing via Browser

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:** `http://localhost:3000`

3. **Test Registration:**
   - Click "Register as Customer/Employee"
   - Fill in the form:
     - Full Name: Test User
     - Email: test@example.com
     - Password: test123
     - Role: Customer
   - Click "Register"
   - Should see success message with Customer ID

4. **Test Login:**
   - Use the credentials you just registered
   - Or use seeded admin: `admin@laundry.com` / `admin123`

## 🔍 Debugging Steps

### If Login Fails:

1. **Check server console** for error messages
2. **Verify MongoDB connection:**
   ```bash
   npm run test-db
   ```
3. **Check if user exists in database:**
   - Check MongoDB Atlas dashboard
   - Or use MongoDB Compass
4. **Check .env.local:**
   ```bash
   cat .env.local
   ```
   Should have: `MONGODB_URI=mongodb+srv://...`

### If Registration Fails:

1. **Check server console** for detailed error
2. **Common issues:**
   - Email already exists → Try different email
   - Missing required fields → Check form validation
   - Database connection error → Check MongoDB connection
3. **Verify data is saved:**
   - Check MongoDB Atlas collections
   - Look for "users" collection

## 📊 Expected Behavior

### Successful Registration:
```json
{
  "success": true,
  "customer_id": "CUS7XK9M2",
  "code": "CUS7XK9M2",
  "message": "Customer registered successfully"
}
```

### Successful Login:
```json
{
  "user": {
    "user_id": "...",
    "customer_id": "CUS7XK9M2",
    "email": "test@example.com",
    "full_name": "Test User",
    "role": "customer",
    "phone": "555-1234"
  }
}
```

## 🐛 Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:**
1. Check `.env.local` has correct `MONGODB_URI`
2. Test connection: `npm run test-db`
3. Check MongoDB Atlas network access (IP whitelist)

### Issue: "Email already registered"
**Solution:**
- Use a different email address
- Or delete the user from MongoDB if testing

### Issue: "Invalid credentials"
**Solution:**
1. Verify email and password are correct
2. Check if user exists in database
3. Ensure password matches exactly (case-sensitive)

### Issue: "Failed to generate unique customer ID"
**Solution:**
- Very rare, but if it happens, try again
- The system retries up to 10 times

## 📝 Server Console Logs

When working correctly, you should see:
```
✅ Database connected for login
✅ Login successful for: user@example.com
```

Or for registration:
```
✅ Database connected for registration
📝 Creating new user: { email: '...', role: 'customer', full_name: '...' }
✅ User registered successfully: { email: '...', customer_id: 'CUS...', role: 'customer' }
```

## 🔐 MongoDB Data Persistence

All data is saved to MongoDB Atlas:
- **Database:** `laundry_management`
- **Collection:** `users`
- **Data persists** across server restarts
- **Check MongoDB Atlas** dashboard to verify data

## 🚀 Quick Fixes

1. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Verify MongoDB connection:**
   ```bash
   npm run test-db
   ```

4. **Check environment variables:**
   ```bash
   cat .env.local
   ```

## 📞 Still Having Issues?

1. Check server console for detailed error messages
2. Verify MongoDB Atlas connection is working
3. Ensure all required fields are provided
4. Check browser console for frontend errors
5. Verify the API routes are being called correctly

