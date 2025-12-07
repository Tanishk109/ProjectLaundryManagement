# Laundry Management System - Routes and Functionalities Documentation

## API Routes

### Authentication
- **POST** `/api/auth/login`
  - Authenticates user and returns user data
  - Body: `{ email, password }`
  - Returns: `{ user }`

### Users
- **GET** `/api/users`
  - Get all users or filter by role
  - Query params: `?role=admin|customer|employee`
  - Returns: `{ users }`
- **POST** `/api/users`
  - Register new user
  - Body: `{ email, password, full_name, role, phone }`
  - Returns: `{ success, user_id }`

### Machines
- **GET** `/api/machines`
  - Get all machines
  - Returns: `{ machines }`
- **POST** `/api/machines`
  - Add new machine
  - Body: `{ machine_name, machine_type, capacity_kg, location }`
  - Returns: `{ success, machine_id }`
- **PATCH** `/api/machines/[machineId]`
  - Update machine status
  - Body: `{ status }`
  - Returns: `{ success }`

### Orders
- **GET** `/api/orders`
  - Get orders with optional filters
  - Query params: `?customer_id=xxx&order_id=xxx&status=xxx`
  - Returns: `{ orders }`
- **POST** `/api/orders`
  - Create new order
  - Body: `{ customer_id, weight_kg, cycle_type, temp_setting, spin_speed, notes }`
  - Returns: `{ success, order_id }`
- **GET** `/api/orders/[orderId]`
  - Get specific order details
  - Returns: `{ order }`
- **PATCH** `/api/orders/[orderId]`
  - Update order status or details
  - Body: `{ status, machine_id, ... }`
  - Returns: `{ success }`
- **GET** `/api/orders/track`
  - Track order by order_id or customer_id
  - Query params: `?order_id=xxx` or `?customer_id=xxx`
  - Returns: `{ order, logs }` or `{ orders }`

### Notifications
- **GET** `/api/notifications`
  - Get notifications for user
  - Query params: `?user_id=xxx`
  - Returns: `{ notifications }`
- **PATCH** `/api/notifications`
  - Mark notification as read
  - Body: `{ notification_id }`
  - Returns: `{ success }`

### Statistics
- **GET** `/api/stats`
  - Get dashboard statistics
  - Query params: `?role=admin|customer|employee&customer_id=xxx`
  - Returns: Statistics object based on role

### Feedback (NEW)
- **GET** `/api/feedback`
  - Get feedback with optional filters
  - Query params: `?customer_id=xxx&order_id=xxx`
  - Returns: `{ feedback }`
- **POST** `/api/feedback`
  - Submit new feedback
  - Body: `{ customer_id, order_id (optional), rating (1-5), comment, category }`
  - Returns: `{ success, message }`

## Frontend Modules and Functionalities

### Login Page
- **Functionality**: User authentication
- **Features**:
  - Login form (email, password, role)
  - Order tracking (without login)
  - Demo account shortcuts
  - Role-based access control

### Admin Dashboard
**Sections:**
1. **Overview**
   - System statistics (machines, customers, employees, orders)
   - Machine status overview
   - Active bookings count

2. **Machines**
   - View all machines
   - Add new machines
   - Update machine status (available/in-use/maintenance)
   - Filter and manage machines

3. **Customers**
   - View all customers
   - Customer details (ID, name, email, phone)
   - Total orders per customer

4. **Employees**
   - View all employees
   - Add new employees
   - Remove employees
   - Orders processed by each employee

5. **All Bookings**
   - View all orders across the system
   - Filter by status, customer, machine
   - Order details and status

6. **Usage Reports**
   - Generate reports
   - Filter by date and machine
   - View detailed cycle logs

### Customer Dashboard
**Sections:**
1. **Dashboard**
   - Customer ID display
   - Current booking status
   - Statistics (total uses, total weight)
   - Machine availability overview
   - Order status tracker

2. **Available Machines**
   - List of available machines
   - Machine details (type, capacity, location)
   - Quick book action

3. **Book Machine**
   - Machine selection
   - Booking form (start time, weight, notes)
   - Submit new order

4. **Track Order**
   - View active orders
   - Order status tracking with visual progress
   - Order details (machine, weight, timestamps)

5. **My Bookings**
   - List all bookings (past and present)
   - Order status
   - Cancel pending orders
   - View booking history

6. **Usage History**
   - Completed orders history
   - Cycle details (weight, type, duration)
   - Past orders with details

7. **Notifications**
   - View all notifications
   - Mark notifications as read
   - Filter unread notifications

8. **Feedback** (NEW)
   - Submit feedback for completed orders
   - Rating system (1-5 stars)
   - Category selection (service, machine, employee, general)
   - Comment field
   - View previous feedback submissions
   - Order-specific or general feedback

### Employee Dashboard
**Sections:**
1. **Overview**
   - Work statistics (pending requests, active cycles)
   - Machines in maintenance
   - Quick status overview

2. **Search Orders**
   - Search by Customer ID or Order ID
   - View order details
   - Update order status from search results

3. **Update Status**
   - Manage active orders
   - Update order status (in-progress, washing, drying, ready, completed)
   - View order details

4. **Machine Status**
   - View all machines
   - Update machine status
   - Change between available/maintenance

5. **Pending Requests**
   - View pending orders
   - Approve or reject orders
   - Assign orders to machines

6. **Cycle Logs**
   - Log cycle details (weight, cycle type, temperature, spin speed)
   - Complete orders after logging
   - View recent logs

7. **Maintenance**
   - Mark machines for maintenance
   - Complete maintenance
   - View machines under maintenance

## Database Tables

1. **users** - User accounts (admin, customer, employee)
2. **machines** - Washing and drying machines
3. **orders** - Laundry orders/bookings
4. **laundry_logs** - Detailed cycle information
5. **notifications** - User notifications
6. **feedback** - Customer feedback and ratings (NEW)

## Key Features

### Order Tracking
- Real-time order status updates
- Visual progress tracker
- Customer ID and Order ID system
- Order history

### Machine Management
- Status management (available, in-use, maintenance)
- Capacity and location tracking
- Machine type (washer/dryer)

### Notifications System
- Order status updates
- Completion alerts
- System notifications

### Feedback System (NEW)
- Rating system (1-5 stars)
- Multiple categories
- Order-specific feedback
- General feedback option
- Feedback history

## Order Status Flow

1. **pending** - Order submitted, awaiting approval
2. **in-progress** - Approved and started
3. **washing** - Currently in washer
4. **drying** - Currently in dryer
5. **ready** - Ready for pickup
6. **completed** - Order completed
7. **cancelled** - Order cancelled


