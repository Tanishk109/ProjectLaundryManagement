# Registration Guide

## Customer Registration

### How to Register
1. On the login page, click "Register as Customer/Employee"
2. Select "Customer" from the Role dropdown
3. Fill in:
   - Full Name (required)
   - Email (required, must be unique)
   - Phone (optional)
   - Password (required, minimum 6 characters)
4. Click "Register"

### Generated Code
- After successful registration, a unique **Customer ID** is automatically generated
- Format: `CUS` followed by 6 alphanumeric characters (e.g., `CUS7XK9M2`)
- **Important**: Save this ID as it will be used for:
  - Tracking orders
  - Order references
  - Account identification

### Features After Registration
- Automatically logged in after registration
- Can book machines
- Can track orders using Customer ID
- Can submit feedback for completed orders
- Access to order history

---

## Employee Registration

### How to Register
1. On the login page, click "Register as Customer/Employee"
2. Select "Employee" from the Role dropdown
3. Fill in:
   - Full Name (required)
   - Email (required, must be unique)
   - Phone (optional)
   - Password (required, minimum 6 characters)
4. Click "Register"

### Generated Code
- After successful registration, a unique **Employee ID** is automatically generated
- Format: `EMP` followed by 6 alphanumeric characters (e.g., `EMP3AB8K1`)
- **Important**: Save this ID for employee identification

### Features After Registration
- Automatically logged in after registration
- Can manage orders (approve/reject pending orders)
- Can update order status
- Can search orders by Customer ID or Order ID
- Can log cycle details
- Can manage machine status and maintenance

---

## Registration API

### Endpoint
`POST /api/users`

### Request Body
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "customer" | "employee",
  "phone": "555-1234" // optional
}
```

### Response (Success)
```json
{
  "success": true,
  "customer_id": "CUS7XK9M2",
  "code": "CUS7XK9M2",
  "message": "Customer registered successfully" | "Employee registered successfully"
}
```

### Response (Error)
```json
{
  "error": "Email already registered" | "Missing required fields" | "Failed to register user"
}
```

---

## Code Generation Rules

### Customer ID
- Prefix: `CUS`
- Format: `CUS` + 6 random alphanumeric characters (uppercase)
- Example: `CUS7XK9M2`
- Stored in `customer_id` field in database
- Unique across all users

### Employee ID
- Prefix: `EMP`
- Format: `EMP` + 6 random alphanumeric characters (uppercase)
- Example: `EMP3AB8K1`
- Stored in `customer_id` field in database (same field as customer_id)
- Unique across all users

### Uniqueness
- System ensures each generated code is unique
- Retries up to 10 times if duplicate is found
- Returns error if unique code cannot be generated after retries

---

## Security Notes

- Passwords are stored as plain text in the current implementation
- **Important**: For production, implement password hashing (bcrypt, argon2, etc.)
- Email addresses must be unique across all user roles
- Registration is open for customers and employees (admins are created manually)

---

## Troubleshooting

### "Email already registered"
- The email address is already in use
- Try logging in instead, or use a different email

### "Failed to generate unique ID"
- Rare occurrence when all random combinations are taken
- Try registering again

### Registration succeeds but can't login
- Wait a moment for auto-login
- If auto-login fails, use the email and password to login manually
- Ensure you select the correct role (Customer or Employee)


