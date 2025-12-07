# MongoDB Connection Troubleshooting

## Current Connection String
```
mongodb+srv://tanishk:8585Ritz2015@cluster0.axlnobz.mongodb.net/Laundry_Management
```

## ❌ Authentication Error

If you see: `bad auth : Authentication failed`

### Possible Causes & Solutions:

#### 1. **User Doesn't Exist**
- Go to MongoDB Atlas → Database Access
- Verify user `tanishk` exists
- If not, create a new database user

#### 2. **Wrong Password**
- Verify the password is correct: `8585Ritz2015`
- If changed, update `.env.local`

#### 3. **IP Address Not Whititelisted**
- Go to MongoDB Atlas → Network Access
- Click "Add IP Address"
- Add your current IP or `0.0.0.0/0` for all IPs (less secure)

#### 4. **Database User Permissions**
- Go to Database Access → Edit user `tanishk`
- Ensure user has "Read and write to any database" or specific permissions

#### 5. **Password Special Characters**
If password has special characters, they may need URL encoding:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- etc.

## ✅ Test Connection

```bash
npm run test-db
```

## 🔧 Quick Fixes

### Option 1: Create New Database User
1. MongoDB Atlas → Database Access → Add New Database User
2. Username: `tanishk` (or new name)
3. Password: `8585Ritz2015` (or new password)
4. Database User Privileges: "Read and write to any database"
5. Update `.env.local` with new credentials

### Option 2: Reset User Password
1. MongoDB Atlas → Database Access
2. Find user `tanishk`
3. Click "Edit" → "Edit Password"
4. Set new password
5. Update `.env.local`

### Option 3: Whitelist IP Address
1. MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Add `0.0.0.0/0` (allows all IPs) OR your specific IP
4. Wait 1-2 minutes for changes to propagate

## 📝 Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

Components:
- `USERNAME`: Database user (e.g., `tanishk`)
- `PASSWORD`: User password (e.g., `8585Ritz2015`)
- `CLUSTER`: Your cluster address (e.g., `cluster0.axlnobz.mongodb.net`)
- `DATABASE_NAME`: Database name (e.g., `Laundry_Management`)

## 🚀 After Fixing

1. Update `.env.local` with correct credentials
2. Test connection: `npm run test-db`
3. Start dev server: `npm run dev`
4. Try registration/login

## 💡 Security Note

- Never commit `.env.local` to git (it's in `.gitignore`)
- Use strong passwords
- Restrict IP whitelist in production
- Use environment-specific users in production

