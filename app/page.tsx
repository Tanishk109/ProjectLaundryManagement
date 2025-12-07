"use client"

import type React from "react"

import { useState, useEffect } from "react"

// ==================== TYPES ====================
interface Machine {
  machine_id: number
  machine_name: string
  machine_type: "washer" | "dryer"
  status: "available" | "in-use" | "maintenance"
  capacity_kg: number
  location: string
}

interface User {
  user_id: number
  customer_id: string
  email: string
  full_name: string
  role: "admin" | "customer" | "employee"
  phone: string
}

interface Booking {
  booking_id: number
  order_id: string
  user_id: number
  machine_id: number
  start_time: string
  end_time?: string
  status: "pending" | "in-progress" | "washing" | "drying" | "ready-for-pickup" | "completed" | "cancelled"
  cycle_duration: number
  weight?: number
  notes?: string
  assigned_employee?: number
  status_updated_at?: string
}

interface LaundryLog {
  log_id: number
  booking_id: number
  weight_kg: number
  cycle_type: string
  temp_setting: string
  spin_speed: number
  logged_at: string
}

interface Notification {
  notification_id: number
  user_id: number
  message: string
  type: "info" | "complete" | "alert"
  is_read: boolean
  created_at: string
}

interface Feedback {
  feedback_id: number
  customer_id: string
  order_id: string | null
  rating: number
  comment: string | null
  category: "service" | "machine" | "employee" | "general"
  created_at: string
}

function generateCustomerId(): string {
  return "CUS" + Math.random().toString(36).substring(2, 8).toUpperCase()
}

function generateOrderId(): string {
  return "ORD" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 4).toUpperCase()
}

// ==================== MOCK DATA ====================
const initialMachines: Machine[] = [
  {
    machine_id: 1,
    machine_name: "Washer A1",
    machine_type: "washer",
    status: "available",
    capacity_kg: 8.5,
    location: "Floor 1 - Room 101",
  },
  {
    machine_id: 2,
    machine_name: "Washer A2",
    machine_type: "washer",
    status: "in-use",
    capacity_kg: 8.5,
    location: "Floor 1 - Room 101",
  },
  {
    machine_id: 3,
    machine_name: "Washer B1",
    machine_type: "washer",
    status: "available",
    capacity_kg: 7.0,
    location: "Floor 2 - Room 201",
  },
  {
    machine_id: 4,
    machine_name: "Dryer A1",
    machine_type: "dryer",
    status: "available",
    capacity_kg: 6.0,
    location: "Floor 1 - Room 102",
  },
  {
    machine_id: 5,
    machine_name: "Dryer A2",
    machine_type: "dryer",
    status: "maintenance",
    capacity_kg: 6.0,
    location: "Floor 1 - Room 102",
  },
  {
    machine_id: 6,
    machine_name: "Dryer B1",
    machine_type: "dryer",
    status: "available",
    capacity_kg: 5.5,
    location: "Floor 2 - Room 202",
  },
]

const initialUsers: User[] = [
  {
    user_id: 1,
    customer_id: "ADMIN001",
    email: "admin@laundry.com",
    full_name: "Admin User",
    role: "admin",
    phone: "555-0001",
  },
  {
    user_id: 2,
    customer_id: "CUS7XK9M2",
    email: "john@student.com",
    full_name: "John Smith",
    role: "customer",
    phone: "555-0002",
  },
  {
    user_id: 3,
    customer_id: "CUS4PL8N5",
    email: "jane@student.com",
    full_name: "Jane Doe",
    role: "customer",
    phone: "555-0003",
  },
  {
    user_id: 4,
    customer_id: "EMP001",
    email: "emp@laundry.com",
    full_name: "Employee One",
    role: "employee",
    phone: "555-0004",
  },
  {
    user_id: 5,
    customer_id: "EMP002",
    email: "emp2@laundry.com",
    full_name: "Employee Two",
    role: "employee",
    phone: "555-0005",
  },
]

const initialBookings: Booking[] = [
  {
    booking_id: 1,
    order_id: "ORDM5K8X2A",
    user_id: 2,
    machine_id: 2,
    start_time: "2024-12-06 14:00",
    end_time: "2024-12-06 14:45",
    status: "washing",
    cycle_duration: 45,
    weight: 5.2,
    assigned_employee: 4,
    status_updated_at: "2024-12-06 14:10",
  },
  {
    booking_id: 2,
    order_id: "ORDP3L9Y7B",
    user_id: 3,
    machine_id: 1,
    start_time: "2024-12-06 15:00",
    status: "pending",
    cycle_duration: 45,
    weight: 4.0,
  },
  {
    booking_id: 3,
    order_id: "ORDK2N6Z4C",
    user_id: 2,
    machine_id: 4,
    start_time: "2024-12-06 10:00",
    end_time: "2024-12-06 10:35",
    status: "completed",
    cycle_duration: 35,
    weight: 3.5,
    assigned_employee: 4,
    status_updated_at: "2024-12-06 10:35",
  },
]

const initialLogs: LaundryLog[] = [
  {
    log_id: 1,
    booking_id: 3,
    weight_kg: 3.5,
    cycle_type: "Normal",
    temp_setting: "Warm",
    spin_speed: 1200,
    logged_at: "2024-12-06",
  },
]

const initialNotifications: Notification[] = [
  {
    notification_id: 1,
    user_id: 2,
    message: "Your laundry cycle is complete! Machine Dryer A1 is ready.",
    type: "complete",
    is_read: false,
    created_at: "2024-12-06 10:35",
  },
  {
    notification_id: 2,
    user_id: 2,
    message: "Booking #1 has been approved by staff.",
    type: "info",
    is_read: true,
    created_at: "2024-12-06 13:55",
  },
]

// ==================== MAIN COMPONENT ====================
export default function LaundryManagementSystem() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [machines, setMachines] = useState<Machine[]>(initialMachines)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [logs, setLogs] = useState<LaundryLog[]>(initialLogs)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [feedback, setFeedback] = useState<Feedback[]>([])

  // Form states
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginRole, setLoginRole] = useState("")
  const [showRegister, setShowRegister] = useState(false)

  // Section states
  const [adminSection, setAdminSection] = useState("overview")
  const [customerSection, setCustomerSection] = useState("dashboard")
  const [employeeSection, setEmployeeSection] = useState("overview")

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        alert("Server error: " + (response.statusText || "Unknown error"))
        return
      }

      const data = await response.json()
      if (response.ok && data.user) {
        // Check if role matches
        if (data.user.role === loginRole) {
          setCurrentUser(data.user)
        } else {
          alert("Invalid role selection")
        }
      } else {
        alert(data.error || "Invalid credentials")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      if (error instanceof SyntaxError) {
        alert("Server returned invalid response. Please try again.")
      } else {
        // Fallback to local state if API fails
        const user = users.find((u) => u.email === loginEmail && u.role === loginRole)
        if (user) {
          setCurrentUser(user)
        } else {
          alert("Invalid credentials or role mismatch")
        }
      }
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setLoginEmail("")
    setLoginPassword("")
    setLoginRole("")
  }

  const fillDemo = (role: string) => {
    if (role === "admin") {
      setLoginEmail("admin@laundry.com")
      setLoginPassword("admin123")
      setLoginRole("admin")
    } else if (role === "customer") {
      setLoginEmail("john@student.com")
      setLoginPassword("pass123")
      setLoginRole("customer")
    } else {
      setLoginEmail("emp@laundry.com")
      setLoginPassword("emp123")
      setLoginRole("employee")
    }
  }

  if (!currentUser) {
    return (
      <LoginPage
        email={loginEmail}
        setEmail={setLoginEmail}
        password={loginPassword}
        setPassword={setLoginPassword}
        role={loginRole}
        setRole={setLoginRole}
        onLogin={handleLogin}
        fillDemo={fillDemo}
        bookings={bookings}
        users={users}
        machines={machines}
        showRegister={showRegister}
        setShowRegister={setShowRegister}
        setCurrentUser={setCurrentUser}
      />
    )
  }

  if (currentUser.role === "admin") {
    return (
      <AdminDashboard
        user={currentUser}
        machines={machines}
        setMachines={setMachines}
        users={users}
        setUsers={setUsers}
        bookings={bookings}
        setBookings={setBookings}
        logs={logs}
        section={adminSection}
        setSection={setAdminSection}
        logout={logout}
      />
    )
  }

  if (currentUser.role === "customer") {
    return (
      <CustomerDashboard
        user={currentUser}
        machines={machines}
        bookings={bookings}
        setBookings={setBookings}
        logs={logs}
        notifications={notifications}
        setNotifications={setNotifications}
        feedback={feedback}
        setFeedback={setFeedback}
        section={customerSection}
        setSection={setCustomerSection}
        logout={logout}
      />
    )
  }

  return (
    <EmployeeDashboard
      user={currentUser}
      machines={machines}
      setMachines={setMachines}
      users={users}
      bookings={bookings}
      setBookings={setBookings}
      logs={logs}
      setLogs={setLogs}
      section={employeeSection}
      setSection={setEmployeeSection}
      logout={logout}
    />
  )
}

// ==================== LOGIN PAGE ====================
function LoginPage({
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  onLogin,
  fillDemo,
  bookings,
  users,
  machines,
  showRegister,
  setShowRegister,
  setCurrentUser,
}: {
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  role: string
  setRole: (v: string) => void
  onLogin: (e: React.FormEvent) => void
  fillDemo: (role: string) => void
  bookings: Booking[]
  users: User[]
  machines: Machine[]
  showRegister: boolean
  setShowRegister: (v: boolean) => void
  setCurrentUser: (user: User) => void
}) {
  const [showTracking, setShowTracking] = useState(false)
  const [trackOrderId, setTrackOrderId] = useState("")
  const [trackCustomerId, setTrackCustomerId] = useState("")
  const [trackingResult, setTrackingResult] = useState<Booking | null>(null)
  const [trackingError, setTrackingError] = useState("")

  // Registration form state
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regFullName, setRegFullName] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regRole, setRegRole] = useState<"customer" | "employee">("customer")
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    success: boolean
    code: string | null
    message: string
  } | null>(null)

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setTrackingError("")
    setTrackingResult(null)

    // Find customer by customer_id
    const customer = users.find((u) => u.customer_id.toLowerCase() === trackCustomerId.toLowerCase())
    if (!customer) {
      setTrackingError("Customer ID not found")
      return
    }

    // Find order by order_id and verify it belongs to the customer
    const order = bookings.find(
      (b) => b.order_id.toLowerCase() === trackOrderId.toLowerCase() && b.user_id === customer.user_id,
    )

    if (!order) {
      setTrackingError("Order not found or does not belong to this customer")
      return
    }

    setTrackingResult(order)
  }

  const getStatusStep = (status: string) => {
    const steps = ["pending", "in-progress", "washing", "drying", "ready-for-pickup", "completed"]
    return steps.indexOf(status)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistrationSuccess(null)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          full_name: regFullName,
          role: regRole,
          phone: regPhone,
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        setRegistrationSuccess({
          success: false,
          code: null,
          message: "Server error: " + (response.statusText || "Unknown error"),
        })
        return
      }

      const data = await response.json()
      if (response.ok && data.success) {
        setRegistrationSuccess({
          success: true,
          code: data.code || null,
          message: data.message || "Registration successful!",
        })
        
        // Auto-login after successful registration
        setTimeout(async () => {
          try {
            const loginResponse = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: regEmail, password: regPassword }),
            })
            
            const loginContentType = loginResponse.headers.get("content-type")
            if (loginContentType && loginContentType.includes("application/json")) {
              const loginData = await loginResponse.json()
              if (loginResponse.ok && loginData.user) {
                setCurrentUser(loginData.user)
                setShowRegister(false)
              }
            }
          } catch (loginError) {
            console.error("Auto-login error:", loginError)
            // User can manually login with the credentials
          }
        }, 2000)

        // Clear form
        setRegEmail("")
        setRegPassword("")
        setRegFullName("")
        setRegPhone("")
      } else {
        setRegistrationSuccess({
          success: false,
          code: null,
          message: data.error || "Registration failed",
        })
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      if (error instanceof SyntaxError) {
        setRegistrationSuccess({
          success: false,
          code: null,
          message: "Server returned invalid response. Please try again.",
        })
      } else {
        setRegistrationSuccess({
          success: false,
          code: null,
          message: "Failed to register. Please try again.",
        })
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>Laundry Manager</h1>
          <p className="subtitle">Track. Manage. Complete.</p>

          {showRegister ? (
            <>
              <h2 style={{ marginBottom: "1rem" }}>
                {regRole === "customer" ? "Customer Registration" : "Employee Registration"}
              </h2>

              {registrationSuccess && (
                <div
                  className={registrationSuccess.success ? "success-message" : "error-message"}
                  style={{
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                    backgroundColor: registrationSuccess.success ? "#d4edda" : "#f8d7da",
                    color: registrationSuccess.success ? "#155724" : "#721c24",
                    border: `1px solid ${registrationSuccess.success ? "#c3e6cb" : "#f5c6cb"}`,
                  }}
                >
                  <p style={{ margin: 0, fontWeight: "bold" }}>{registrationSuccess.message}</p>
                  {registrationSuccess.success && registrationSuccess.code && (
                    <div style={{ marginTop: "0.5rem", padding: "0.5rem", backgroundColor: "#fff", borderRadius: "4px" }}>
                      <p style={{ margin: 0, fontSize: "0.9rem" }}>
                        <strong>Your {regRole === "customer" ? "Customer" : "Employee"} ID:</strong>
                      </p>
                      <code
                        style={{
                          display: "block",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          color: "#155724",
                          marginTop: "0.25rem",
                        }}
                      >
                        {registrationSuccess.code}
                      </code>
                      <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                        Please save this ID for future use!
                      </p>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Role:</label>
                  <select value={regRole} onChange={(e) => setRegRole(e.target.value as "customer" | "employee")}>
                    <option value="customer">Customer</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Register
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowRegister(false)
                    setRegistrationSuccess(null)
                    setRegEmail("")
                    setRegPassword("")
                    setRegFullName("")
                    setRegPhone("")
                  }}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Back to Login
                </button>
              </form>
            </>
          ) : !showTracking ? (
            <>
              <form onSubmit={onLogin}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="customer">Customer</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>

              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <p style={{ marginBottom: "0.5rem", color: "#666" }}>Don't have an account?</p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRegister(true)}
                  style={{ marginBottom: "1rem" }}
                >
                  Register as Customer/Employee
                </button>
              </div>

              <button type="button" className="btn btn-secondary track-order-btn" onClick={() => setShowTracking(true)}>
                Track Your Order
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleTrackOrder} className="tracking-form">
                <h3>Track Your Order</h3>

                <div className="form-group">
                  <label>Customer ID</label>
                  <input
                    type="text"
                    value={trackCustomerId}
                    onChange={(e) => setTrackCustomerId(e.target.value)}
                    placeholder="e.g., CUS7XK9M2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Order ID</label>
                  <input
                    type="text"
                    value={trackOrderId}
                    onChange={(e) => setTrackOrderId(e.target.value)}
                    placeholder="e.g., ORDM5K8X2A"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Track Order
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowTracking(false)
                    setTrackingResult(null)
                    setTrackingError("")
                  }}
                >
                  Back to Login
                </button>
              </form>

              {trackingError && <div className="tracking-error">{trackingError}</div>}

              {trackingResult && (
                <div className="tracking-result">
                  <h4>Order: {trackingResult.order_id}</h4>

                  <div className="order-details">
                    <p>
                      <strong>Machine:</strong>{" "}
                      {machines.find((m) => m.machine_id === trackingResult.machine_id)?.machine_name}
                    </p>
                    <p>
                      <strong>Weight:</strong> {trackingResult.weight || "-"} kg
                    </p>
                    <p>
                      <strong>Started:</strong> {trackingResult.start_time}
                    </p>
                    {trackingResult.status_updated_at && (
                      <p>
                        <strong>Last Update:</strong> {trackingResult.status_updated_at}
                      </p>
                    )}
                  </div>

                  <div className="status-tracker">
                    <h5>Order Status</h5>
                    <div className="status-steps">
                      {["Pending", "In Progress", "Washing", "Drying", "Ready for Pickup", "Completed"].map(
                        (step, idx) => (
                          <div
                            key={step}
                            className={`status-step ${idx <= getStatusStep(trackingResult.status) ? "active" : ""} ${trackingResult.status === "cancelled" ? "cancelled" : ""}`}
                          >
                            <div className="step-circle">{idx + 1}</div>
                            <span className="step-label">{step}</span>
                          </div>
                        ),
                      )}
                    </div>
                    {trackingResult.status === "cancelled" && (
                      <p className="cancelled-text">This order was cancelled</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== ADMIN DASHBOARD ====================
function AdminDashboard({
  user,
  machines,
  setMachines,
  users,
  setUsers,
  bookings,
  setBookings,
  logs,
  section,
  setSection,
  logout,
}: {
  user: User
  machines: Machine[]
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  bookings: Booking[]
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
  logs: LaundryLog[]
  section: string
  setSection: (s: string) => void
  logout: () => void
}) {
  const [showMachineForm, setShowMachineForm] = useState(false)
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [newMachine, setNewMachine] = useState({ name: "", type: "washer", capacity: "", location: "" })
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", phone: "", password: "" })
  const [loading, setLoading] = useState(true)
  const [bookingFilter, setBookingFilter] = useState<"all" | "pending" | "active" | "completed">("all")

  // Load data from MongoDB when admin logs in
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true)
        
        // Load all users (customers and employees) first
        let formattedUsers: User[] = []
        const usersResponse = await fetch("/api/users")
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          if (usersData.users) {
            // Convert MongoDB format to frontend format
            formattedUsers = usersData.users.map((u: any, index: number) => ({
              user_id: index + 1,
              customer_id: u.customer_id || null,
              email: u.email,
              full_name: u.full_name,
              role: u.role,
              phone: u.phone || "",
            }))
            setUsers(formattedUsers)
          }
        }

        // Load all machines
        let formattedMachines: Machine[] = []
        const machinesResponse = await fetch("/api/machines")
        if (machinesResponse.ok) {
          const machinesData = await machinesResponse.json()
          if (machinesData.machines) {
            // Convert MongoDB format to frontend format
            formattedMachines = machinesData.machines.map((m: any, index: number) => ({
              machine_id: index + 1,
              machine_name: m.machine_name,
              machine_type: m.machine_type,
              status: m.status,
              capacity_kg: m.capacity_kg,
              location: m.location,
            }))
            setMachines(formattedMachines)
          }
        }

        // Load all orders (after machines are loaded for proper mapping)
        const ordersResponse = await fetch("/api/orders")
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          if (ordersData.orders) {
            // Convert MongoDB format to frontend format
            const formattedBookings = ordersData.orders.map((o: any, index: number) => {
              const customer = formattedUsers.find((u) => u.customer_id === o.customer_id)
              // Find machine by name (since we have machine_name in the order response)
              let machineId: number | null = null
              if (o.machine_name) {
                const machine = formattedMachines.find((m) => m.machine_name === o.machine_name)
                machineId = machine ? machine.machine_id : null
              }
              return {
                booking_id: index + 1,
                order_id: o.order_id,
                user_id: customer?.user_id || 0,
                machine_id: machineId,
                start_time: o.created_at ? new Date(o.created_at).toLocaleString() : new Date().toLocaleString(),
                end_time: o.actual_completion ? new Date(o.actual_completion).toLocaleString() : undefined,
                status: o.status || "pending",
                cycle_duration: 45,
                weight: o.weight_kg || 0,
                notes: o.notes || "",
                assigned_employee: undefined,
                status_updated_at: o.updated_at ? new Date(o.updated_at).toLocaleString() : undefined,
              }
            })
            setBookings(formattedBookings)
          }
        }
      } catch (error) {
        console.error("Error loading admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, []) // Load once when component mounts

  const customers = users.filter((u) => u.role === "customer")
  const employees = users.filter((u) => u.role === "employee")
  const activeBookings = bookings.filter(
    (b) => b.status === "in-progress" || b.status === "washing" || b.status === "drying",
  )

  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/machines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machine_name: newMachine.name,
          machine_type: newMachine.type,
          capacity_kg: Number.parseFloat(newMachine.capacity),
          location: newMachine.location,
        }),
      })

      if (response.ok) {
        alert("Machine added successfully!")
        // Reload machines
        const machinesResponse = await fetch("/api/machines")
        if (machinesResponse.ok) {
          const machinesData = await machinesResponse.json()
          if (machinesData.machines) {
            const formattedMachines = machinesData.machines.map((m: any, index: number) => ({
              machine_id: index + 1,
              machine_name: m.machine_name,
              machine_type: m.machine_type,
              status: m.status,
              capacity_kg: m.capacity_kg,
              location: m.location,
            }))
            setMachines(formattedMachines)
          }
        }
        setNewMachine({ name: "", type: "washer", capacity: "", location: "" })
        setShowMachineForm(false)
      } else {
        const data = await response.json()
        alert(data.error || "Failed to add machine")
      }
    } catch (error) {
      console.error("Error adding machine:", error)
      alert("Failed to add machine. Please try again.")
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmployee.email,
          password: newEmployee.password,
          full_name: newEmployee.name,
          role: "employee",
          phone: newEmployee.phone,
        }),
      })

      const data = await response.json()
      if (response.ok && data.success) {
        alert("Employee added successfully! Employee ID: " + data.customer_id)
        // Reload users to get the new employee
        const usersResponse = await fetch("/api/users")
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          if (usersData.users) {
            const formattedUsers = usersData.users.map((u: any, index: number) => ({
              user_id: index + 1,
              customer_id: u.customer_id || null,
              email: u.email,
              full_name: u.full_name,
              role: u.role,
              phone: u.phone || "",
            }))
            setUsers(formattedUsers)
          }
        }
        setNewEmployee({ name: "", email: "", phone: "", password: "" })
        setShowEmployeeForm(false)
      } else {
        alert(data.error || "Failed to add employee")
      }
    } catch (error) {
      console.error("Error adding employee:", error)
      alert("Failed to add employee. Please try again.")
    }
  }

  const updateMachineStatus = (id: number, status: Machine["status"]) => {
    setMachines(machines.map((m) => (m.machine_id === id ? { ...m, status } : m)))
  }

  const removeEmployee = (id: number) => {
    if (confirm("Remove this employee?")) {
      setUsers(users.filter((u) => u.user_id !== id))
    }
  }

  // Accept/Approve order
  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "in-progress",
        }),
      })

      if (response.ok) {
        alert("Order accepted and moved to in-progress!")
        // Reload bookings
        const ordersResponse = await fetch("/api/orders")
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          if (ordersData.orders) {
            const formattedBookings = ordersData.orders.map((o: any, index: number) => {
              const customer = users.find((u) => u.customer_id === o.customer_id)
              let machineId: number | null = null
              if (o.machine_name) {
                const machine = machines.find((m) => m.machine_name === o.machine_name)
                machineId = machine ? machine.machine_id : null
              }
              return {
                booking_id: index + 1,
                order_id: o.order_id,
                user_id: customer?.user_id || 0,
                machine_id: machineId,
                start_time: o.created_at ? new Date(o.created_at).toLocaleString() : new Date().toLocaleString(),
                end_time: o.actual_completion ? new Date(o.actual_completion).toLocaleString() : undefined,
                status: o.status || "pending",
                cycle_duration: 45,
                weight: o.weight_kg || 0,
                notes: o.notes || "",
                assigned_employee: undefined,
                status_updated_at: o.updated_at ? new Date(o.updated_at).toLocaleString() : undefined,
              }
            })
            setBookings(formattedBookings)
          }
        }
      } else {
        const data = await response.json()
        alert(data.error || "Failed to accept order")
      }
    } catch (error) {
      console.error("Error accepting order:", error)
      alert("Failed to accept order. Please try again.")
    }
  }

  return (
    <div className="dashboard-page">
      <header className="header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <span className="user-info">Welcome, {user.full_name}</span>
            <button className="btn btn-small" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        <nav className="sidebar">
          <ul className="nav-menu">
            <li>
              <a
                className={`nav-item ${section === "overview" ? "active" : ""}`}
                onClick={() => setSection("overview")}
              >
                Overview
              </a>
            </li>
            <li>
              <a
                className={`nav-item ${section === "machines" ? "active" : ""}`}
                onClick={() => setSection("machines")}
              >
                Machines
              </a>
            </li>
            <li>
              <a
                className={`nav-item ${section === "customers" ? "active" : ""}`}
                onClick={() => setSection("customers")}
              >
                Customers
              </a>
            </li>
            <li>
              <a
                className={`nav-item ${section === "employees" ? "active" : ""}`}
                onClick={() => setSection("employees")}
              >
                Employees
              </a>
            </li>
            <li>
              <a
                className={`nav-item ${section === "bookings" ? "active" : ""}`}
                onClick={() => setSection("bookings")}
              >
                All Bookings
              </a>
            </li>
            <li>
              <a className={`nav-item ${section === "usage" ? "active" : ""}`} onClick={() => setSection("usage")}>
                Usage Reports
              </a>
            </li>
          </ul>
        </nav>

        <main className="content">
          {section === "overview" && (
            <section className="section-content">
              <h2>System Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Machines</h3>
                  <p className="stat-number">{machines.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Bookings</h3>
                  <p className="stat-number">{activeBookings.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Customers</h3>
                  <p className="stat-number">{customers.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Staff Members</h3>
                  <p className="stat-number">{employees.length}</p>
                </div>
              </div>

              <h3>Machine Status</h3>
              <div className="machine-grid">
                {machines.map((machine) => (
                  <MachineCard key={machine.machine_id} machine={machine} />
                ))}
              </div>
            </section>
          )}

          {section === "machines" && (
            <section className="section-content">
              <h2>Manage Machines</h2>
              <button className="btn btn-primary btn-add" onClick={() => setShowMachineForm(!showMachineForm)}>
                + Add Machine
              </button>

              {showMachineForm && (
                <form className="add-form" onSubmit={handleAddMachine}>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Machine Name"
                      value={newMachine.name}
                      onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                      required
                    />
                    <select
                      value={newMachine.type}
                      onChange={(e) => setNewMachine({ ...newMachine, type: e.target.value })}
                    >
                      <option value="washer">Washer</option>
                      <option value="dryer">Dryer</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Capacity (kg)"
                      value={newMachine.capacity}
                      onChange={(e) => setNewMachine({ ...newMachine, capacity: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={newMachine.location}
                      onChange={(e) => setNewMachine({ ...newMachine, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowMachineForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Capacity</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((machine) => (
                    <tr key={machine.machine_id}>
                      <td>{machine.machine_id}</td>
                      <td>{machine.machine_name}</td>
                      <td>{machine.machine_type}</td>
                      <td>
                        <span className={`status-badge status-${machine.status}`}>{machine.status}</span>
                      </td>
                      <td>{machine.capacity_kg} kg</td>
                      <td>{machine.location}</td>
                      <td>
                        <select
                          className="status-select"
                          value=""
                          onChange={(e) =>
                            e.target.value &&
                            updateMachineStatus(machine.machine_id, e.target.value as Machine["status"])
                          }
                        >
                          <option value="">Change...</option>
                          <option value="available">Available</option>
                          <option value="in-use">In Use</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {!loading && section === "customers" && (
            <section className="section-content">
              <h2>Customer Management</h2>
              <p className="section-desc">View all registered customers and their details</p>
              {customers.length === 0 ? (
                <p className="empty-message">No customers found</p>
              ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Total Orders</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.user_id}>
                      <td>
                        <code className="customer-id-code">{customer.customer_id}</code>
                      </td>
                      <td>{customer.full_name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{bookings.filter((b) => b.user_id === customer.user_id).length}</td>
                      <td>
                        <span className="status-badge status-available">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </section>
          )}

          {!loading && section === "employees" && (
            <section className="section-content">
              <h2>Employee Management</h2>
              <button className="btn btn-primary btn-add" onClick={() => setShowEmployeeForm(!showEmployeeForm)}>
                + Add Employee
              </button>

              {showEmployeeForm && (
                <form className="add-form" onSubmit={handleAddEmployee}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    required
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowEmployeeForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Orders Processed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.user_id}>
                      <td>
                        <code className="customer-id-code">{emp.customer_id}</code>
                      </td>
                      <td>{emp.full_name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>{bookings.filter((b) => b.assigned_employee === emp.user_id).length}</td>
                      <td>
                        <button className="btn btn-small btn-danger" onClick={() => removeEmployee(emp.user_id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {!loading && section === "bookings" && (
            <section className="section-content">
              <h2>All Order Requests</h2>
              <p className="section-desc">View all orders across the system</p>
              {bookings.length === 0 ? (
                <p className="empty-message">No orders found</p>
              ) : (
                <>
                  <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <strong>Pending Orders:</strong> {bookings.filter((b) => b.status === "pending").length} |{" "}
                      <strong>Total Orders:</strong> {bookings.length}
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
                      <button
                        className={`btn btn-small ${bookingFilter === "all" ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => setBookingFilter("all")}
                      >
                        All
                      </button>
                      <button
                        className={`btn btn-small ${bookingFilter === "pending" ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => setBookingFilter("pending")}
                      >
                        Pending ({bookings.filter((b) => b.status === "pending").length})
                      </button>
                      <button
                        className={`btn btn-small ${bookingFilter === "active" ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => setBookingFilter("active")}
                      >
                        Active
                      </button>
                      <button
                        className={`btn btn-small ${bookingFilter === "completed" ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => setBookingFilter("completed")}
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                  <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer ID</th>
                    <th>Customer</th>
                    <th>Machine</th>
                    <th>Start Time</th>
                    <th>Weight</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter((b) => {
                      if (bookingFilter === "pending") return b.status === "pending"
                      if (bookingFilter === "active")
                        return b.status === "in-progress" || b.status === "washing" || b.status === "drying"
                      if (bookingFilter === "completed") return b.status === "completed"
                      return true
                    })
                    .sort((a, b) => {
                      // Sort pending orders first
                      if (a.status === "pending" && b.status !== "pending") return -1
                      if (a.status !== "pending" && b.status === "pending") return 1
                      return 0
                    })
                    .map((booking) => {
                    const customer = users.find((u) => u.user_id === booking.user_id)
                    const machine = machines.find((m) => m.machine_id === booking.machine_id)
                    const employee = users.find((u) => u.user_id === booking.assigned_employee)
                    return (
                      <tr key={booking.booking_id}>
                        <td>
                          <code className="order-id-code">{booking.order_id}</code>
                        </td>
                        <td>
                          <code className="customer-id-code">{customer?.customer_id || "N/A"}</code>
                        </td>
                        <td>{customer?.full_name || "Unknown"}</td>
                        <td>{machine?.machine_name || "Not assigned"}</td>
                        <td>{booking.start_time}</td>
                        <td>{booking.weight || "-"} kg</td>
                        <td>
                          <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                        </td>
                        <td>{employee?.full_name || "-"}</td>
                        <td>
                          {booking.status === "pending" && (
                            <button
                              className="btn btn-small btn-primary"
                              onClick={() => handleAcceptOrder(booking.order_id)}
                              style={{ marginRight: "0.5rem" }}
                            >
                              Accept
                            </button>
                          )}
                          {booking.status !== "pending" && booking.status !== "completed" && booking.status !== "cancelled" && (
                            <span className="status-badge status-active">Active</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
                </>
              )}
            </section>
          )}

          {!loading && section === "usage" && (
            <section className="section-content">
              <h2>Usage Reports</h2>
              <div className="filter-section">
                <input type="date" />
                <select>
                  <option value="">All Machines</option>
                  {machines.map((m) => (
                    <option key={m.machine_id} value={m.machine_id}>
                      {m.machine_name}
                    </option>
                  ))}
                </select>
                <button className="btn btn-secondary">Generate Report</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Machine</th>
                    <th>Weight (kg)</th>
                    <th>Cycle Type</th>
                    <th>Temperature</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const booking = bookings.find((b) => b.booking_id === log.booking_id)
                    const customer = users.find((u) => u.user_id === booking?.user_id)
                    const machine = machines.find((m) => m.machine_id === booking?.machine_id)
                    return (
                      <tr key={log.log_id}>
                        <td>
                          <code className="order-id-code">{booking?.order_id}</code>
                        </td>
                        <td>{log.logged_at}</td>
                        <td>{customer?.full_name || "Unknown"}</td>
                        <td>{machine?.machine_name || "Unknown"}</td>
                        <td>{log.weight_kg}</td>
                        <td>{log.cycle_type}</td>
                        <td>{log.temp_setting}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

// ==================== CUSTOMER DASHBOARD ====================
function CustomerDashboard({
  user,
  machines,
  bookings,
  setBookings,
  logs,
  notifications,
  setNotifications,
  feedback,
  setFeedback,
  section,
  setSection,
  logout,
}: {
  user: User
  machines: Machine[]
  bookings: Booking[]
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
  logs: LaundryLog[]
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  feedback: Feedback[]
  setFeedback: React.Dispatch<React.SetStateAction<Feedback[]>>
  section: string
  setSection: (s: string) => void
  logout: () => void
}) {
  const [selectedMachine, setSelectedMachine] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [bookingWeight, setBookingWeight] = useState("")
  const [bookingNotes, setBookingNotes] = useState("")
  
  // Feedback form state
  const [feedbackOrderId, setFeedbackOrderId] = useState("")
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState("")
  const [feedbackCategory, setFeedbackCategory] = useState<"service" | "machine" | "employee" | "general">("general")

  // Load feedback when component mounts or user changes
  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const response = await fetch(`/api/feedback?customer_id=${user.customer_id}`)
        const data = await response.json()
        if (data.feedback) {
          setFeedback(data.feedback)
        }
      } catch (error) {
        console.error("Error loading feedback:", error)
      }
    }
    loadFeedback()
  }, [user.customer_id])

  const myBookings = bookings.filter((b) => b.user_id === user.user_id)
  const currentBooking = myBookings.find(
    (b) => b.status === "in-progress" || b.status === "washing" || b.status === "drying",
  )
  const completedBookings = myBookings.filter((b) => b.status === "completed")
  const availableMachines = machines.filter((m) => m.status === "available")
  const myNotifications = notifications.filter((n) => n.user_id === user.user_id)

  const totalWeight = completedBookings.reduce((sum, b) => sum + (b.weight || 0), 0)

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    const newOrderId = generateOrderId()
    const newBooking: Booking = {
      booking_id: bookings.length + 1,
      order_id: newOrderId,
      user_id: user.user_id,
      machine_id: Number.parseInt(selectedMachine),
      start_time: bookingTime,
      status: "pending",
      cycle_duration: 45,
      weight: Number.parseFloat(bookingWeight),
      notes: bookingNotes,
    }
    setBookings([...bookings, newBooking])
    alert(
      `Booking submitted!\n\nYour Order ID: ${newOrderId}\nYour Customer ID: ${user.customer_id}\n\nSave these for tracking!`,
    )
    setSelectedMachine("")
    setBookingTime("")
    setBookingWeight("")
    setBookingNotes("")
  }

  const cancelBooking = (id: number) => {
    setBookings(bookings.map((b) => (b.booking_id === id ? { ...b, status: "cancelled" as const } : b)))
  }

  const markNotificationRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n)))
  }

  const selectedMachineData = machines.find((m) => m.machine_id === Number.parseInt(selectedMachine))

  const getStatusStep = (status: string) => {
    const steps = ["pending", "in-progress", "washing", "drying", "ready-for-pickup", "completed"]
    return steps.indexOf(status)
  }

  return (
    <div className="dashboard-page">
      <header className="header">
        <div className="header-content">
          <h1>My Laundry</h1>
          <div className="header-actions">
            <span className="customer-id-display">ID: {user.customer_id}</span>
            <span className="user-info">Welcome, {user.full_name}</span>
            <button className="btn btn-small" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        <nav className="sidebar">
          <ul className="nav-menu">
            <li>
              <a
                className={`nav-item ${section === "dashboard" ? "active" : ""}`}
                onClick={() => setSection("dashboard")}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                className={`nav-item ${section === "machines" ? "active" : ""}`}
                onClick={() => setSection("machines")}
              >
                Available Machines
              </a>
            </li>
            <li>
              <a className={`nav-item ${section === "book" ? "active" : ""}`} onClick={() => setSection("book")}>
                Book Machine
              </a>
            </li>
            <li>
              <a className={`nav-item ${section === "track" ? "active" : ""}`} onClick={() => setSection("track")}>
                Track Order
              </a>
            </li>
            <li>
              <a
                className={`nav-item ${section === "bookings" ? "active" : ""}`}
                onClick={() => setSection("bookings")}
              >
                My Bookings
              </a>
            </li>
            <li>
              <a className={`nav-item ${section === "history" ? "active" : ""}`} onClick={() => setSection("history")}>
                Usage History
              </a>
            </li>
            <li>
              <a
                className={`nav-item ${section === "notifications" ? "active" : ""}`}
                onClick={() => setSection("notifications")}
              >
                Notifications ({myNotifications.filter((n) => !n.is_read).length})
              </a>
            </li>
            <li>
              <a
                className={`nav-item ${section === "feedback" ? "active" : ""}`}
                onClick={() => setSection("feedback")}
              >
                Feedback
              </a>
            </li>
          </ul>
        </nav>

        <main className="content">
          {section === "dashboard" && (
            <section className="section-content">
              <h2>Welcome Back!</h2>

              <div className="customer-id-card">
                <h4>Your Customer ID</h4>
                <code className="large-id">{user.customer_id}</code>
                <p className="id-hint">Use this ID to track your orders</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Current Booking</h4>
                  <p className="stat-text">{currentBooking ? currentBooking.order_id : "None"}</p>
                </div>
                <div className="stat-card">
                  <h4>Total Uses</h4>
                  <p className="stat-text">{myBookings.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Total Weight</h4>
                  <p className="stat-text">{totalWeight.toFixed(1)} kg</p>
                </div>
              </div>

              {currentBooking && (
                <div className="current-order-status">
                  <h3>Current Order Status</h3>
                  <div className="order-info-box">
                    <p>
                      <strong>Order ID:</strong> <code>{currentBooking.order_id}</code>
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`status-badge status-${currentBooking.status}`}>{currentBooking.status}</span>
                    </p>
                  </div>
                  <div className="status-tracker">
                    <div className="status-steps">
                      {["Pending", "In Progress", "Washing", "Drying", "Ready for Pickup", "Completed"].map(
                        (step, idx) => (
                          <div
                            key={step}
                            className={`status-step ${idx <= getStatusStep(currentBooking.status) ? "active" : ""}`}
                          >
                            <div className="step-circle">{idx + 1}</div>
                            <span className="step-label">{step}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="section-box">
                <h3>Machine Availability</h3>
                <div className="machine-grid">
                  {machines.map((machine) => (
                    <MachineCard key={machine.machine_id} machine={machine} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {section === "machines" && (
            <section className="section-content">
              <h2>Available Machines</h2>
              <div className="machine-grid">
                {availableMachines.map((machine) => (
                  <div key={machine.machine_id} className="machine-card">
                    <h4>{machine.machine_name}</h4>
                    <p className="machine-info">
                      <strong>Type:</strong> {machine.machine_type}
                    </p>
                    <p className="machine-info">
                      <strong>Capacity:</strong> {machine.capacity_kg} kg
                    </p>
                    <p className="machine-info">
                      <strong>Location:</strong> {machine.location}
                    </p>
                    <button
                      className="btn btn-primary btn-book"
                      onClick={() => {
                        setSelectedMachine(String(machine.machine_id))
                        setSection("book")
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {section === "book" && (
            <section className="section-content">
              <h2>Book a Machine</h2>
              <form className="booking-form" onSubmit={handleBooking}>
                <div className="form-group">
                  <label>Select Machine:</label>
                  <select value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)} required>
                    <option value="">Choose a machine...</option>
                    {availableMachines.map((m) => (
                      <option key={m.machine_id} value={m.machine_id}>
                        {m.machine_name} - {m.machine_type}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMachineData && (
                  <div className="machine-details">
                    <p>
                      <strong>Type:</strong> {selectedMachineData.machine_type}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {selectedMachineData.capacity_kg} kg
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedMachineData.location}
                    </p>
                  </div>
                )}

                <div className="form-group">
                  <label>Start Time:</label>
                  <input
                    type="datetime-local"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Expected Weight (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 5.5"
                    value={bookingWeight}
                    onChange={(e) => setBookingWeight(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Notes:</label>
                  <textarea
                    placeholder="Any special instructions..."
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  Book Now
                </button>
              </form>
            </section>
          )}

          {section === "track" && (
            <section className="section-content">
              <h2>Track Your Orders</h2>

              <div className="tracking-info-box">
                <p>
                  <strong>Your Customer ID:</strong> <code className="large-id">{user.customer_id}</code>
                </p>
              </div>

              <h3>Your Active Orders</h3>
              {myBookings.filter((b) => b.status !== "completed" && b.status !== "cancelled").length === 0 ? (
                <p className="empty-message">No active orders</p>
              ) : (
                <div className="orders-list">
                  {myBookings
                    .filter((b) => b.status !== "completed" && b.status !== "cancelled")
                    .map((booking) => {
                      const machine = machines.find((m) => m.machine_id === booking.machine_id)
                      return (
                        <div key={booking.booking_id} className="order-track-card">
                          <div className="order-header">
                            <h4>
                              Order: <code>{booking.order_id}</code>
                            </h4>
                            <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                          </div>
                          <div className="order-details">
                            <p>
                              <strong>Machine:</strong> {machine?.machine_name}
                            </p>
                            <p>
                              <strong>Weight:</strong> {booking.weight} kg
                            </p>
                            <p>
                              <strong>Started:</strong> {booking.start_time}
                            </p>
                            {booking.status_updated_at && (
                              <p>
                                <strong>Last Update:</strong> {booking.status_updated_at}
                              </p>
                            )}
                          </div>
                          <div className="status-tracker">
                            <div className="status-steps">
                              {["Pending", "In Progress", "Washing", "Drying", "Ready", "Done"].map((step, idx) => (
                                <div
                                  key={step}
                                  className={`status-step ${idx <= getStatusStep(booking.status) ? "active" : ""}`}
                                >
                                  <div className="step-circle">{idx + 1}</div>
                                  <span className="step-label">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </section>
          )}

          {section === "bookings" && (
            <section className="section-content">
              <h2>My Bookings</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Machine</th>
                    <th>Start Time</th>
                    <th>Weight</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map((booking) => {
                    const machine = machines.find((m) => m.machine_id === booking.machine_id)
                    return (
                      <tr key={booking.booking_id}>
                        <td>
                          <code className="order-id-code">{booking.order_id}</code>
                        </td>
                        <td>{machine?.machine_name || "Unknown"}</td>
                        <td>{booking.start_time}</td>
                        <td>{booking.weight || "-"} kg</td>
                        <td>
                          <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                        </td>
                        <td>
                          {booking.status === "pending" && (
                            <button
                              className="btn btn-small btn-danger"
                              onClick={() => cancelBooking(booking.booking_id)}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </section>
          )}

          {section === "history" && (
            <section className="section-content">
              <h2>Usage History</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Machine</th>
                    <th>Weight (kg)</th>
                    <th>Cycle Type</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {completedBookings.map((booking) => {
                    const machine = machines.find((m) => m.machine_id === booking.machine_id)
                    const log = logs.find((l) => l.booking_id === booking.booking_id)
                    return (
                      <tr key={booking.booking_id}>
                        <td>
                          <code className="order-id-code">{booking.order_id}</code>
                        </td>
                        <td>{booking.start_time.split(" ")[0]}</td>
                        <td>{machine?.machine_name || "Unknown"}</td>
                        <td>{log?.weight_kg || booking.weight || "-"}</td>
                        <td>{log?.cycle_type || "Normal"}</td>
                        <td>{booking.cycle_duration} min</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </section>
          )}

          {section === "notifications" && (
            <section className="section-content">
              <h2>Notifications</h2>
              <div className="notifications-list">
                {myNotifications.length === 0 ? (
                  <p>No notifications</p>
                ) : (
                  myNotifications.map((notif) => (
                    <div
                      key={notif.notification_id}
                      className={`notification-item ${notif.type} ${notif.is_read ? "read" : ""}`}
                    >
                      <div className="notification-text">
                        <p>{notif.message}</p>
                        <span className="notification-meta">
                          {notif.type.toUpperCase()} - {notif.created_at}
                        </span>
                      </div>
                      {!notif.is_read && (
                        <button className="btn btn-small" onClick={() => markNotificationRead(notif.notification_id)}>
                          Mark Read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {section === "feedback" && (
            <section className="section-content">
              <h2>Submit Feedback</h2>
              <p className="section-desc">Share your experience and help us improve our service</p>

              <form
                className="feedback-form"
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (feedbackRating === 0) {
                    alert("Please select a rating")
                    return
                  }

                  try {
                    const response = await fetch("/api/feedback", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        customer_id: user.customer_id,
                        order_id: feedbackOrderId || null,
                        rating: feedbackRating,
                        comment: feedbackComment,
                        category: feedbackCategory,
                      }),
                    })

                    const data = await response.json()
                    if (response.ok) {
                      alert("Thank you for your feedback!")
                      setFeedbackOrderId("")
                      setFeedbackRating(0)
                      setFeedbackComment("")
                      setFeedbackCategory("general")
                      // Refresh feedback list
                      const feedbackResponse = await fetch(`/api/feedback?customer_id=${user.customer_id}`)
                      const feedbackData = await feedbackResponse.json()
                      if (feedbackData.feedback) {
                        setFeedback(feedbackData.feedback)
                      }
                    } else {
                      alert(data.error || "Failed to submit feedback")
                    }
                  } catch (error) {
                    console.error("Feedback submission error:", error)
                    alert("Failed to submit feedback. Please try again.")
                  }
                }}
              >
                <div className="form-group">
                  <label>Order ID (Optional):</label>
                  <select
                    value={feedbackOrderId}
                    onChange={(e) => setFeedbackOrderId(e.target.value)}
                  >
                    <option value="">Select an order...</option>
                    {completedBookings.map((booking) => (
                      <option key={booking.booking_id} value={booking.order_id}>
                        {booking.order_id} - {booking.start_time.split(" ")[0]}
                      </option>
                    ))}
                  </select>
                  <small>Leave empty for general feedback</small>
                </div>

                <div className="form-group">
                  <label>Category:</label>
                  <select
                    value={feedbackCategory}
                    onChange={(e) => setFeedbackCategory(e.target.value as typeof feedbackCategory)}
                  >
                    <option value="general">General</option>
                    <option value="service">Service</option>
                    <option value="machine">Machine</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Rating: *</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${feedbackRating >= star ? "active" : ""}`}
                        onClick={() => setFeedbackRating(star)}
                        onMouseEnter={() => {
                          if (feedbackRating === 0) {
                            document.querySelectorAll(".star-btn").forEach((btn, idx) => {
                              if (idx < star) {
                                btn.classList.add("hover")
                              } else {
                                btn.classList.remove("hover")
                              }
                            })
                          }
                        }}
                        onMouseLeave={() => {
                          document.querySelectorAll(".star-btn").forEach((btn) => {
                            btn.classList.remove("hover")
                          })
                        }}
                      >
                        ★
                      </button>
                    ))}
                    {feedbackRating > 0 && <span className="rating-text">({feedbackRating}/5)</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Comment:</label>
                  <textarea
                    placeholder="Tell us about your experience..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    rows={5}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit Feedback
                </button>
              </form>

              <div className="my-feedback-section" style={{ marginTop: "3rem" }}>
                <h3>My Previous Feedback</h3>
                {feedback.length === 0 ? (
                  <p className="empty-message">No feedback submitted yet</p>
                ) : (
                  <div className="feedback-list">
                    {feedback.map((fb) => (
                      <div key={fb.feedback_id} className="feedback-item">
                        <div className="feedback-header">
                          <div>
                            <strong>{fb.order_id || "General Feedback"}</strong>
                            <span className="feedback-category">({fb.category})</span>
                          </div>
                          <div className="feedback-rating">
                            {"★".repeat(fb.rating)}
                            {"☆".repeat(5 - fb.rating)}
                          </div>
                        </div>
                        {fb.comment && <p className="feedback-comment">{fb.comment}</p>}
                        <span className="feedback-date">
                          {new Date(fb.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

// ==================== EMPLOYEE DASHBOARD ====================
function EmployeeDashboard({
  user,
  machines,
  setMachines,
  users,
  bookings,
  setBookings,
  logs,
  setLogs,
  section,
  setSection,
  logout,
}: {
  user: User
  machines: Machine[]
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>
  users: User[]
  bookings: Booking[]
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
  logs: LaundryLog[]
  setLogs: React.Dispatch<React.SetStateAction<LaundryLog[]>>
  section: string
  setSection: (s: string) => void
  logout: () => void
}) {
  const [logBooking, setLogBooking] = useState("")
  const [logWeight, setLogWeight] = useState("")
  const [logCycleType, setLogCycleType] = useState("")
  const [logTemp, setLogTemp] = useState("")
  const [logSpin, setLogSpin] = useState("")
  const [maintenanceMachine, setMaintenanceMachine] = useState("")

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Booking[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const activeBookings = bookings.filter(
    (b) =>
      b.status === "in-progress" || b.status === "washing" || b.status === "drying" || b.status === "ready-for-pickup",
  )
  const maintenanceMachines = machines.filter((m) => m.status === "maintenance")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim().toUpperCase()

    if (!query) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    // Search by order ID
    let results = bookings.filter((b) => b.order_id.toUpperCase().includes(query))

    // If no results, search by customer ID
    if (results.length === 0) {
      const customer = users.find((u) => u.customer_id.toUpperCase().includes(query))
      if (customer) {
        results = bookings.filter((b) => b.user_id === customer.user_id)
      }
    }

    setSearchResults(results)
    setShowSearchResults(true)
  }

  const approveBooking = (id: number) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16)
    setBookings(
      bookings.map((b) =>
        b.booking_id === id
          ? { ...b, status: "in-progress" as const, assigned_employee: user.user_id, status_updated_at: now }
          : b,
      ),
    )
    const booking = bookings.find((b) => b.booking_id === id)
    if (booking) {
      setMachines(machines.map((m) => (m.machine_id === booking.machine_id ? { ...m, status: "in-use" as const } : m)))
    }
  }

  const rejectBooking = (id: number) => {
    setBookings(bookings.map((b) => (b.booking_id === id ? { ...b, status: "cancelled" as const } : b)))
  }

  const updateOrderStatus = (bookingId: number, newStatus: Booking["status"]) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16)
    setBookings(
      bookings.map((b) =>
        b.booking_id === bookingId
          ? { ...b, status: newStatus, assigned_employee: user.user_id, status_updated_at: now }
          : b,
      ),
    )

    // Update machine status based on order status
    const booking = bookings.find((b) => b.booking_id === bookingId)
    if (booking) {
      if (newStatus === "completed" || newStatus === "cancelled") {
        setMachines(
          machines.map((m) => (m.machine_id === booking.machine_id ? { ...m, status: "available" as const } : m)),
        )
      }
    }
  }

  const handleCycleLog = (e: React.FormEvent) => {
    e.preventDefault()
    const newLog: LaundryLog = {
      log_id: logs.length + 1,
      booking_id: Number.parseInt(logBooking),
      weight_kg: Number.parseFloat(logWeight),
      cycle_type: logCycleType,
      temp_setting: logTemp,
      spin_speed: Number.parseInt(logSpin),
      logged_at: new Date().toISOString().split("T")[0],
    }
    setLogs([...logs, newLog])

    const now = new Date().toISOString().replace("T", " ").substring(0, 16)
    setBookings(
      bookings.map((b) =>
        b.booking_id === Number.parseInt(logBooking)
          ? { ...b, status: "completed" as const, status_updated_at: now }
          : b,
      ),
    )
    const booking = bookings.find((b) => b.booking_id === Number.parseInt(logBooking))
    if (booking) {
      setMachines(
        machines.map((m) => (m.machine_id === booking.machine_id ? { ...m, status: "available" as const } : m)),
      )
    }

    alert("Cycle logged successfully!")
    setLogBooking("")
    setLogWeight("")
    setLogCycleType("")
    setLogTemp("")
    setLogSpin("")
  }

  const updateMachineStatus = (id: number, status: Machine["status"]) => {
    setMachines(machines.map((m) => (m.machine_id === id ? { ...m, status } : m)))
  }

  const markForMaintenance = () => {
    if (!maintenanceMachine) return alert("Select a machine first")
    setMachines(
      machines.map((m) =>
        m.machine_id === Number.parseInt(maintenanceMachine) ? { ...m, status: "maintenance" as const } : m,
      ),
    )
    setMaintenanceMachine("")
  }

  const completeMaintenance = (id: number) => {
    setMachines(machines.map((m) => (m.machine_id === id ? { ...m, status: "available" as const } : m)))
  }

  return (
    <div className="dashboard-page">
      <header className="header">
        <div className="header-content">
          <h1>Employee Portal</h1>
          <div className="header-actions">
            <span className="user-info">Welcome, {user.full_name}</span>
            <button className="btn btn-small" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        <nav className="sidebar">
          <ul className="nav-menu">
            <li>
              <a
                className={`nav-item ${section === "overview" ? "active" : ""}`}
                onClick={() => setSection("overview")}
              >
                Overview
              </a>
            </li>
            <li>
              <a className={`nav-item ${section === "search" ? "active" : ""}`} onClick={() => setSection("search")}>
                Search Orders
              </a>
            </li>
            <li>
              <a
                className={`nav-item ${section === "update-status" ? "active" : ""}`}
                onClick={() => setSection("update-status")}
              >
                Update Status
              </a>
            </li>
            <li>
              <a
                className={`nav-item ${section === "machines" ? "active" : ""}`}
                onClick={() => setSection("machines")}
              >
                Machine Status
              </a>
            </li>
            <li>
              <a className={`nav-item ${section === "pending" ? "active" : ""}`} onClick={() => setSection("pending")}>
                Pending Requests ({pendingBookings.length})
              </a>
            </li>
            <li>
              <a className={`nav-item ${section === "logs" ? "active" : ""}`} onClick={() => setSection("logs")}>
                Cycle Logs
              </a>
            </li>
            <li>
              <a
                className={`nav-item ${section === "maintenance" ? "active" : ""}`}
                onClick={() => setSection("maintenance")}
              >
                Maintenance
              </a>
            </li>
          </ul>
        </nav>

        <main className="content">
          {section === "overview" && (
            <section className="section-content">
              <h2>Work Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Pending Requests</h3>
                  <p className="stat-number">{pendingBookings.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Cycles</h3>
                  <p className="stat-number">{activeBookings.length}</p>
                </div>
                <div className="stat-card">
                  <h3>In Maintenance</h3>
                  <p className="stat-number">{maintenanceMachines.length}</p>
                </div>
              </div>

              <div className="section-box">
                <h3>Quick Status</h3>
                <div className="machine-grid">
                  {machines.map((machine) => (
                    <MachineCard key={machine.machine_id} machine={machine} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {section === "search" && (
            <section className="section-content">
              <h2>Search Orders</h2>
              <form className="search-form" onSubmit={handleSearch}>
                <div className="search-row">
                  <input
                    type="text"
                    placeholder="Enter Customer ID or Order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchQuery("")
                      setShowSearchResults(false)
                      setSearchResults([])
                    }}
                  >
                    Clear
                  </button>
                </div>
              </form>

              {showSearchResults && (
                <div className="search-results">
                  <h3>Search Results ({searchResults.length} found)</h3>
                  {searchResults.length === 0 ? (
                    <p className="empty-message">No orders found matching your search</p>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer ID</th>
                          <th>Customer</th>
                          <th>Machine</th>
                          <th>Weight</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((booking) => {
                          const customer = users.find((u) => u.user_id === booking.user_id)
                          const machine = machines.find((m) => m.machine_id === booking.machine_id)
                          return (
                            <tr key={booking.booking_id}>
                              <td>
                                <code className="order-id-code">{booking.order_id}</code>
                              </td>
                              <td>
                                <code className="customer-id-code">{customer?.customer_id}</code>
                              </td>
                              <td>{customer?.full_name}</td>
                              <td>{machine?.machine_name}</td>
                              <td>{booking.weight} kg</td>
                              <td>
                                <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                              </td>
                              <td>
                                <select
                                  className="status-select"
                                  value=""
                                  onChange={(e) =>
                                    e.target.value &&
                                    updateOrderStatus(booking.booking_id, e.target.value as Booking["status"])
                                  }
                                >
                                  <option value="">Update...</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="washing">Washing</option>
                                  <option value="drying">Drying</option>
                                  <option value="ready-for-pickup">Ready for Pickup</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              <div className="search-hint">
                <h4>How to Search:</h4>
                <ul>
                  <li>Enter a Customer ID (e.g., CUS7XK9M2) to see all orders from that customer</li>
                  <li>Enter an Order ID (e.g., ORDM5K8X2A) to find a specific order</li>
                </ul>
              </div>
            </section>
          )}

          {section === "update-status" && (
            <section className="section-content">
              <h2>Update Order Status</h2>
              <p className="section-desc">Manage active orders and update their status</p>

              {activeBookings.length === 0 ? (
                <p className="empty-message">No active orders to update</p>
              ) : (
                <div className="orders-update-list">
                  {activeBookings.map((booking) => {
                    const customer = users.find((u) => u.user_id === booking.user_id)
                    const machine = machines.find((m) => m.machine_id === booking.machine_id)
                    return (
                      <div key={booking.booking_id} className="order-update-card">
                        <div className="order-update-header">
                          <div>
                            <h4>
                              Order: <code>{booking.order_id}</code>
                            </h4>
                            <p className="order-customer">
                              Customer: {customer?.full_name} (<code>{customer?.customer_id}</code>)
                            </p>
                          </div>
                          <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                        </div>
                        <div className="order-update-details">
                          <p>
                            <strong>Machine:</strong> {machine?.machine_name}
                          </p>
                          <p>
                            <strong>Weight:</strong> {booking.weight} kg
                          </p>
                          <p>
                            <strong>Started:</strong> {booking.start_time}
                          </p>
                        </div>
                        <div className="order-update-actions">
                          <label>Update Status:</label>
                          <div className="status-buttons">
                            <button
                              className={`btn btn-status ${booking.status === "in-progress" ? "active" : ""}`}
                              onClick={() => updateOrderStatus(booking.booking_id, "in-progress")}
                            >
                              In Progress
                            </button>
                            <button
                              className={`btn btn-status ${booking.status === "washing" ? "active" : ""}`}
                              onClick={() => updateOrderStatus(booking.booking_id, "washing")}
                            >
                              Washing
                            </button>
                            <button
                              className={`btn btn-status ${booking.status === "drying" ? "active" : ""}`}
                              onClick={() => updateOrderStatus(booking.booking_id, "drying")}
                            >
                              Drying
                            </button>
                            <button
                              className={`btn btn-status ${booking.status === "ready-for-pickup" ? "active" : ""}`}
                              onClick={() => updateOrderStatus(booking.booking_id, "ready-for-pickup")}
                            >
                              Ready for Pickup
                            </button>
                            <button
                              className="btn btn-success"
                              onClick={() => updateOrderStatus(booking.booking_id, "completed")}
                            >
                              Mark Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {section === "machines" && (
            <section className="section-content">
              <h2>Machine Status Management</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((machine) => (
                    <tr key={machine.machine_id}>
                      <td>{machine.machine_id}</td>
                      <td>{machine.machine_name}</td>
                      <td>{machine.machine_type}</td>
                      <td>
                        <span className={`status-badge status-${machine.status}`}>{machine.status}</span>
                      </td>
                      <td>{machine.location}</td>
                      <td>
                        <select
                          className="status-select"
                          value=""
                          onChange={(e) =>
                            e.target.value &&
                            updateMachineStatus(machine.machine_id, e.target.value as Machine["status"])
                          }
                        >
                          <option value="">Change...</option>
                          <option value="available">Available</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {section === "pending" && (
            <section className="section-content">
              <h2>Pending Requests</h2>
              {pendingBookings.length === 0 ? (
                <p className="empty-message">No pending requests</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer ID</th>
                      <th>Customer</th>
                      <th>Machine</th>
                      <th>Time</th>
                      <th>Weight</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBookings.map((booking) => {
                      const customer = users.find((u) => u.user_id === booking.user_id)
                      const machine = machines.find((m) => m.machine_id === booking.machine_id)
                      return (
                        <tr key={booking.booking_id}>
                          <td>
                            <code className="order-id-code">{booking.order_id}</code>
                          </td>
                          <td>
                            <code className="customer-id-code">{customer?.customer_id}</code>
                          </td>
                          <td>{customer?.full_name || "Unknown"}</td>
                          <td>{machine?.machine_name || "Unknown"}</td>
                          <td>{booking.start_time}</td>
                          <td>{booking.weight || "-"} kg</td>
                          <td>
                            <button
                              className="btn btn-small btn-success"
                              onClick={() => approveBooking(booking.booking_id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-small btn-danger"
                              onClick={() => rejectBooking(booking.booking_id)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </section>
          )}

          {section === "logs" && (
            <section className="section-content">
              <h2>Log Cycle Details</h2>
              <form className="log-form" onSubmit={handleCycleLog}>
                <div className="form-row">
                  <select value={logBooking} onChange={(e) => setLogBooking(e.target.value)} required>
                    <option value="">Select Order...</option>
                    {activeBookings.map((b) => {
                      const machine = machines.find((m) => m.machine_id === b.machine_id)
                      return (
                        <option key={b.booking_id} value={b.booking_id}>
                          {b.order_id} - {machine?.machine_name}
                        </option>
                      )
                    })}
                  </select>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Weight (kg)"
                    value={logWeight}
                    onChange={(e) => setLogWeight(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <select value={logCycleType} onChange={(e) => setLogCycleType(e.target.value)} required>
                    <option value="">Cycle Type</option>
                    <option value="Normal">Normal</option>
                    <option value="Delicate">Delicate</option>
                    <option value="Heavy Duty">Heavy Duty</option>
                    <option value="Quick">Quick</option>
                  </select>
                  <select value={logTemp} onChange={(e) => setLogTemp(e.target.value)} required>
                    <option value="">Temperature</option>
                    <option value="Cold">Cold</option>
                    <option value="Warm">Warm</option>
                    <option value="Hot">Hot</option>
                  </select>
                </div>

                <div className="form-row">
                  <input
                    type="number"
                    placeholder="Spin Speed (RPM)"
                    value={logSpin}
                    onChange={(e) => setLogSpin(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Log Cycle
                </button>
              </form>

              <h3>Recent Logs</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Order ID</th>
                    <th>Weight</th>
                    <th>Cycle</th>
                    <th>Temp</th>
                    <th>Spin</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const booking = bookings.find((b) => b.booking_id === log.booking_id)
                    return (
                      <tr key={log.log_id}>
                        <td>{log.log_id}</td>
                        <td>
                          <code className="order-id-code">{booking?.order_id}</code>
                        </td>
                        <td>{log.weight_kg} kg</td>
                        <td>{log.cycle_type}</td>
                        <td>{log.temp_setting}</td>
                        <td>{log.spin_speed} RPM</td>
                        <td>{log.logged_at}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </section>
          )}

          {section === "maintenance" && (
            <section className="section-content">
              <h2>Machine Maintenance</h2>
              <div className="maintenance-section">
                <h3>Mark Machine for Maintenance</h3>
                <div className="form-row">
                  <select value={maintenanceMachine} onChange={(e) => setMaintenanceMachine(e.target.value)}>
                    <option value="">Select Machine...</option>
                    {machines
                      .filter((m) => m.status !== "maintenance")
                      .map((m) => (
                        <option key={m.machine_id} value={m.machine_id}>
                          {m.machine_name}
                        </option>
                      ))}
                  </select>
                  <button type="button" className="btn btn-warning" onClick={markForMaintenance}>
                    Mark as Maintenance
                  </button>
                </div>
              </div>

              <h3>Machines Under Maintenance</h3>
              {maintenanceMachines.length === 0 ? (
                <p className="empty-message">No machines under maintenance</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceMachines.map((machine) => (
                      <tr key={machine.machine_id}>
                        <td>{machine.machine_id}</td>
                        <td>{machine.machine_name}</td>
                        <td>{machine.machine_type}</td>
                        <td>{machine.location}</td>
                        <td>
                          <button
                            className="btn btn-small btn-success"
                            onClick={() => completeMaintenance(machine.machine_id)}
                          >
                            Complete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

// ==================== SHARED COMPONENTS ====================
function MachineCard({ machine }: { machine: Machine }) {
  return (
    <div className="machine-card">
      <h4>{machine.machine_name}</h4>
      <p className="machine-info">
        <strong>Type:</strong> {machine.machine_type}
      </p>
      <p className="machine-info">
        <strong>Capacity:</strong> {machine.capacity_kg} kg
      </p>
      <p className="machine-info">
        <strong>Location:</strong> {machine.location}
      </p>
      <span className={`status-badge status-${machine.status}`}>
        {machine.status.charAt(0).toUpperCase() + machine.status.slice(1).replace("-", " ")}
      </span>
    </div>
  )
}
