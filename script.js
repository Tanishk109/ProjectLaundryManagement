// ==================== STATE MANAGEMENT ====================
const state = {
  currentUser: null,
  machines: [],
  users: [],
  bookings: [],
  notifications: [],
  laundryLogs: [],
}

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  loadMockData()
  setDefaultDateTime()
})

function loadMockData() {
  // Mock data - In production, this would come from backend API
  state.machines = [
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

  state.users = [
    { user_id: 1, email: "admin@laundry.com", full_name: "Admin User", role: "admin", phone: "555-0001" },
    { user_id: 2, email: "john@student.com", full_name: "John Smith", role: "customer", phone: "555-0002" },
    { user_id: 3, email: "jane@student.com", full_name: "Jane Doe", role: "customer", phone: "555-0003" },
    { user_id: 4, email: "emp@laundry.com", full_name: "Employee One", role: "employee", phone: "555-0004" },
    { user_id: 5, email: "emp2@laundry.com", full_name: "Employee Two", role: "employee", phone: "555-0005" },
  ]

  state.bookings = [
    {
      booking_id: 1,
      user_id: 2,
      machine_id: 2,
      start_time: "2024-12-06 14:00",
      end_time: "2024-12-06 14:45",
      status: "in-progress",
      cycle_duration: 45,
    },
    { booking_id: 2, user_id: 3, machine_id: 1, start_time: "2024-12-06 15:00", status: "pending", cycle_duration: 45 },
    {
      booking_id: 3,
      user_id: 2,
      machine_id: 4,
      start_time: "2024-12-06 10:00",
      end_time: "2024-12-06 10:35",
      status: "completed",
      cycle_duration: 35,
    },
  ]

  state.laundryLogs = [
    { log_id: 1, booking_id: 1, weight_kg: 5.2, cycle_type: "Normal", temp_setting: "Warm", spin_speed: 1200 },
  ]

  state.notifications = [
    { notification_id: 1, user_id: 2, message: "Your laundry cycle is complete", type: "complete", is_read: false },
  ]
}

// ==================== LOGIN FUNCTIONALITY ====================
function handleLogin(event) {
  event.preventDefault()
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const role = document.getElementById("role").value

  // Simple validation
  if (!email || !password || !role) {
    alert("Please fill all fields")
    return
  }

  // Find user
  const user = state.users.find((u) => u.email === email && u.role === role)

  if (user) {
    state.currentUser = user
    showPage(role)
    populateDashboard(role)
  } else {
    alert("Invalid credentials or role mismatch")
  }
}

function fillDemoAdmin() {
  document.getElementById("email").value = "admin@laundry.com"
  document.getElementById("password").value = "admin123"
  document.getElementById("role").value = "admin"
}

function fillDemoCustomer() {
  document.getElementById("email").value = "john@student.com"
  document.getElementById("password").value = "pass123"
  document.getElementById("role").value = "customer"
}

function fillDemoEmployee() {
  document.getElementById("email").value = "emp@laundry.com"
  document.getElementById("password").value = "emp123"
  document.getElementById("role").value = "employee"
}

function logout() {
  state.currentUser = null
  document.getElementById("login-form").reset()
  showPage("login")
}

// ==================== PAGE NAVIGATION ====================
function showPage(page) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"))
  document.getElementById(page + "-page").classList.add("active")
}

function showAdminSection(section) {
  document.querySelectorAll("#admin-page .section").forEach((s) => s.classList.remove("active"))
  document.getElementById("admin-" + section).classList.add("active")
  updateNavActive("admin", section)
}

function showCustomerSection(section) {
  document.querySelectorAll("#customer-page .section").forEach((s) => s.classList.remove("active"))
  document.getElementById("customer-" + section).classList.add("active")
  updateNavActive("customer", section)
}

function showEmployeeSection(section) {
  document.querySelectorAll("#employee-page .section").forEach((s) => s.classList.remove("active"))
  document.getElementById("employee-" + section).classList.add("active")
  updateNavActive("employee", section)
}

function updateNavActive(page, section) {
  const sidebar = document.querySelector("#" + page + "-page .sidebar")
  sidebar.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"))
  const target = sidebar.querySelector(`a[onclick*="'${section}'"]`)
  if (target) target.classList.add("active")
}

// ==================== DASHBOARD POPULATION ====================
function populateDashboard(role) {
  if (role === "admin") populateAdminDashboard()
  else if (role === "customer") populateCustomerDashboard()
  else if (role === "employee") populateEmployeeDashboard()
}

function populateAdminDashboard() {
  document.getElementById("admin-user").textContent = `Welcome, ${state.currentUser.full_name}`

  // Stats
  document.getElementById("stat-machines").textContent = state.machines.length
  document.getElementById("stat-bookings").textContent = state.bookings.filter((b) => b.status === "in-progress").length
  document.getElementById("stat-customers").textContent = state.users.filter((u) => u.role === "customer").length
  document.getElementById("stat-employees").textContent = state.users.filter((u) => u.role === "employee").length

  // Machine status
  renderMachineStatus("admin-machine-status")

  // Populate tables
  populateMachinesTable()
  populateCustomersTable()
  populateEmployeesTable()
  populateAllBookingsTable()

  // Populate machine select for booking filter
  populateMachineSelect("usage-machine-filter")
}

function populateCustomerDashboard() {
  document.getElementById("customer-user").textContent = `Welcome, ${state.currentUser.full_name}`

  const currentBooking = state.bookings.find(
    (b) => b.user_id === state.currentUser.user_id && b.status === "in-progress",
  )
  document.getElementById("cust-current-booking").textContent = currentBooking
    ? `Machine ${currentBooking.machine_id} - ${currentBooking.start_time}`
    : "None"

  // Usage stats
  const customerBookings = state.bookings.filter((b) => b.user_id === state.currentUser.user_id)
  document.getElementById("cust-total-uses").textContent = customerBookings.length

  // This month calculation
  const thisMonthLogs = state.laundryLogs.filter((log) => {
    const booking = state.bookings.find((b) => b.booking_id === log.booking_id)
    return booking && booking.user_id === state.currentUser.user_id
  })
  const totalWeight = thisMonthLogs.reduce((sum, log) => sum + log.weight_kg, 0)
  document.getElementById("cust-this-month").textContent = totalWeight.toFixed(1) + " kg"

  // Render machine status
  renderMachineStatus("customer-machine-status")

  // Populate forms and tables
  populateBookMachineSelect()
  populateCustomerBookingsTable()
  populateCustomerHistoryTable()
  populateCustomerNotifications()
  renderAvailableMachines()
}

function populateEmployeeDashboard() {
  document.getElementById("employee-user").textContent = `Welcome, ${state.currentUser.full_name}`

  const pending = state.bookings.filter((b) => b.status === "pending").length
  const active = state.bookings.filter((b) => b.status === "in-progress").length
  const maintenance = state.machines.filter((m) => m.status === "maintenance").length

  document.getElementById("emp-pending-count").textContent = pending
  document.getElementById("emp-active-count").textContent = active
  document.getElementById("emp-maintenance-count").textContent = maintenance

  renderMachineStatus("employee-quick-status")
  populateEmployeeMachinesTable()
  populateEmployeePendingTable()
  populateEmployeeLogsTable()
  populateEmployeeMaintenanceTable()
  populateLogBookingSelect()
  populateMaintenanceMachineSelect()
}

// ==================== RENDERING FUNCTIONS ====================
function renderMachineStatus(containerId) {
  const container = document.getElementById(containerId)
  container.innerHTML = ""

  state.machines.forEach((machine) => {
    const card = document.createElement("div")
    card.className = "machine-card"

    const statusClass = `status-${machine.status.replace("-", "")}`

    card.innerHTML = `
            <h4>${machine.machine_name}</h4>
            <p class="machine-info"><strong>Type:</strong> ${machine.machine_type}</p>
            <p class="machine-info"><strong>Capacity:</strong> ${machine.capacity_kg} kg</p>
            <p class="machine-info"><strong>Location:</strong> ${machine.location}</p>
            <span class="status-badge ${statusClass}">${machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}</span>
        `

    container.appendChild(card)
  })
}

function renderAvailableMachines() {
  const container = document.getElementById("customer-machines-list")
  container.innerHTML = ""

  const available = state.machines.filter((m) => m.status === "available")

  available.forEach((machine) => {
    const card = document.createElement("div")
    card.className = "machine-card"

    card.innerHTML = `
            <h4>${machine.machine_name}</h4>
            <p class="machine-info"><strong>Type:</strong> ${machine.machine_type}</p>
            <p class="machine-info"><strong>Capacity:</strong> ${machine.capacity_kg} kg</p>
            <p class="machine-info"><strong>Location:</strong> ${machine.location}</p>
            <button class="btn btn-primary" onclick="selectMachineForBooking(${machine.machine_id})">Book Now</button>
        `

    container.appendChild(card)
  })
}

// ==================== TABLE POPULATION ====================
function populateMachinesTable() {
  const tbody = document.querySelector("#admin-machines-table tbody")
  tbody.innerHTML = ""

  state.machines.forEach((machine) => {
    const row = tbody.insertRow()
    row.innerHTML = `
            <td>${machine.machine_id}</td>
            <td>${machine.machine_name}</td>
            <td>${machine.machine_type}</td>
            <td><span class="status-badge status-${machine.status.replace("-", "")}">${machine.status}</span></td>
            <td>${machine.capacity_kg} kg</td>
            <td>${machine.location}</td>
            <td>
                <button class="btn btn-small" onclick="updateMachineStatus(${machine.machine_id})">Update</button>
            </td>
        `
  })
}

function populateCustomersTable() {
  const tbody = document.querySelector("#admin-customers-table tbody")
  tbody.innerHTML = ""

  const customers = state.users.filter((u) => u.role === "customer")

  customers.forEach((customer) => {
    const row = tbody.insertRow()
    row.innerHTML = `
            <td>${customer.user_id}</td>
            <td>${customer.full_name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>Active</td>
            <td>
                <button class="btn btn-small" onclick="viewCustomerDetails(${customer.user_id})">View</button>
            </td>
        `
  })
}

function populateEmployeesTable() {
  const tbody = document.querySelector("#admin-employees-table tbody")
  tbody.innerHTML = ""

  const employees = state.users.filter((u) => u.role === "employee")

  employees.forEach((employee) => {
    const row = tbody.insertRow()
    row.innerHTML = `
            <td>${employee.user_id}</td>
            <td>${employee.full_name}</td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>Active</td>
            <td>
                <button class="btn btn-small" onclick="removeEmployee(${employee.user_id})">Remove</button>
            </td>
        `
  })
}

function populateAllBookingsTable() {
  const tbody = document.querySelector("#admin-bookings-table tbody")
  tbody.innerHTML = ""

  state.bookings.forEach((booking) => {
    const user = state.users.find((u) => u.user_id === booking.user_id)
    const machine = state.machines.find((m) => m.machine_id === booking.machine_id)
    const row = tbody.insertRow()

    row.innerHTML = `
            <td>${booking.booking_id}</td>
            <td>${user ? user.full_name : "Unknown"}</td>
            <td>${machine ? machine.machine_name : "Unknown"}</td>
            <td>${booking.start_time}</td>
            <td><span class="status-badge status-${booking.status.replace("-", "")}">${booking.status}</span></td>
            <td>
                <button class="btn btn-small" onclick="editBooking(${booking.booking_id})">Edit</button>
            </td>
        `
  })
}

function populateCustomerBookingsTable() {
  const tbody = document.querySelector("#customer-bookings-table tbody")
  tbody.innerHTML = ""

  const customerBookings = state.bookings.filter((b) => b.user_id === state.currentUser.user_id)

  customerBookings.forEach((booking) => {
    const machine = state.machines.find((m) => m.machine_id === booking.machine_id)
    const row = tbody.insertRow()

    row.innerHTML = `
            <td>${booking.booking_id}</td>
            <td>${machine ? machine.machine_name : "Unknown"}</td>
            <td>${booking.start_time}</td>
            <td><span class="status-badge status-${booking.status.replace("-", "")}">${booking.status}</span></td>
            <td>
                <button class="btn btn-small" onclick="cancelBooking(${booking.booking_id})">Cancel</button>
            </td>
        `
  })
}

function populateCustomerHistoryTable() {
  const tbody = document.querySelector("#customer-history-table tbody")
  tbody.innerHTML = ""

  const customerBookings = state.bookings.filter(
    (b) => b.user_id === state.currentUser.user_id && b.status === "completed",
  )

  customerBookings.forEach((booking) => {
    const machine = state.machines.find((m) => m.machine_id === booking.machine_id)
    const logs = state.laundryLogs.filter((l) => l.booking_id === booking.booking_id)

    logs.forEach((log) => {
      const row = tbody.insertRow()
      row.innerHTML = `
                <td>${new Date(booking.start_time).toLocaleDateString()}</td>
                <td>${machine ? machine.machine_name : "Unknown"}</td>
                <td>${log.weight_kg} kg</td>
                <td>${log.cycle_type}</td>
                <td>${booking.cycle_duration} min</td>
            `
    })
  })
}

function populateCustomerNotifications() {
  const container = document.getElementById("customer-notifications-list")
  container.innerHTML = ""

  const userNotifications = state.notifications.filter((n) => n.user_id === state.currentUser.user_id)

  if (userNotifications.length === 0) {
    container.innerHTML = "<p>No notifications</p>"
    return
  }

  userNotifications.forEach((notif) => {
    const div = document.createElement("div")
    div.className = `notification-item ${notif.type}`
    div.innerHTML = `
            <div class="notification-text">
                <p>${notif.message}</p>
                <span class="notification-type">${notif.type.toUpperCase()}</span>
            </div>
            <button class="btn btn-small" onclick="markNotificationRead(${notif.notification_id})">
                ${notif.is_read ? "Read" : "Mark Read"}
            </button>
        `
    container.appendChild(div)
  })
}

function populateEmployeeMachinesTable() {
  const tbody = document.querySelector("#employee-machines-table tbody")
  tbody.innerHTML = ""

  state.machines.forEach((machine) => {
    const row = tbody.insertRow()
    row.innerHTML = `
            <td>${machine.machine_id}</td>
            <td>${machine.machine_name}</td>
            <td>${machine.machine_type}</td>
            <td><span class="status-badge status-${machine.status.replace("-", "")}">${machine.status}</span></td>
            <td>${machine.location}</td>
            <td>
                <select onchange="updateMachineStatusEmployee(${machine.machine_id}, this.value)">
                    <option value="">Change Status</option>
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </td>
        `
  })
}

function populateEmployeePendingTable() {
  const tbody = document.querySelector("#employee-pending-table tbody")
  tbody.innerHTML = ""

  const pending = state.bookings.filter((b) => b.status === "pending")

  pending.forEach((booking) => {
    const user = state.users.find((u) => u.user_id === booking.user_id)
    const machine = state.machines.find((m) => m.machine_id === booking.machine_id)
    const row = tbody.insertRow()

    row.innerHTML = `
            <td>${booking.booking_id}</td>
            <td>${user ? user.full_name : "Unknown"}</td>
            <td>${machine ? machine.machine_name : "Unknown"}</td>
            <td>${booking.start_time}</td>
            <td>
                <button class="btn btn-small" onclick="approveBooking(${booking.booking_id})">Approve</button>
                <button class="btn btn-small" onclick="rejectBooking(${booking.booking_id})">Reject</button>
            </td>
        `
  })
}

function populateEmployeeLogsTable() {
  const tbody = document.querySelector("#employee-logs-table tbody")
  tbody.innerHTML = ""

  state.laundryLogs.forEach((log) => {
    const row = tbody.insertRow()
    row.innerHTML = `
            <td>${log.log_id}</td>
            <td>${log.booking_id}</td>
            <td>${log.weight_kg} kg</td>
            <td>${log.cycle_type}</td>
            <td>${log.temp_setting}</td>
            <td>${log.spin_speed} RPM</td>
            <td>Today</td>
        `
  })
}

function populateEmployeeMaintenanceTable() {
  const tbody = document.querySelector("#employee-maintenance-table tbody")
  tbody.innerHTML = ""

  const maintenance = state.machines.filter((m) => m.status === "maintenance")

  maintenance.forEach((machine) => {
    const row = tbody.insertRow()
    row.innerHTML = `
            <td>${machine.machine_id}</td>
            <td>${machine.machine_name}</td>
            <td>${machine.machine_type}</td>
            <td>${machine.location}</td>
            <td>
                <button class="btn btn-small" onclick="completeMaintenance(${machine.machine_id})">Complete</button>
            </td>
        `
  })
}

// ==================== SELECT/DROPDOWN POPULATION ====================
function populateBookMachineSelect() {
  const select = document.getElementById("book-machine-select")
  select.innerHTML = '<option value="">Choose a machine...</option>'

  const available = state.machines.filter((m) => m.status === "available")
  available.forEach((machine) => {
    const option = document.createElement("option")
    option.value = machine.machine_id
    option.textContent = `${machine.machine_name} - ${machine.machine_type}`
    select.appendChild(option)
  })
}

function populateMachineSelect(selectId) {
  const select = document.getElementById(selectId)
  select.innerHTML = '<option value="">All Machines</option>'

  state.machines.forEach((machine) => {
    const option = document.createElement("option")
    option.value = machine.machine_id
    option.textContent = machine.machine_name
    select.appendChild(option)
  })
}

function populateLogBookingSelect() {
  const select = document.getElementById("log-booking-select")
  select.innerHTML = '<option value="">Select Booking...</option>'

  const inProgress = state.bookings.filter((b) => b.status === "in-progress")
  inProgress.forEach((booking) => {
    const machine = state.machines.find((m) => m.machine_id === booking.machine_id)
    const option = document.createElement("option")
    option.value = booking.booking_id
    option.textContent = `Booking #${booking.booking_id} - ${machine?.machine_name}`
    select.appendChild(option)
  })
}

function populateMaintenanceMachineSelect() {
  const select = document.getElementById("maintenance-machine-select")
  select.innerHTML = '<option value="">Select Machine...</option>'

  state.machines
    .filter((m) => m.status !== "maintenance")
    .forEach((machine) => {
      const option = document.createElement("option")
      option.value = machine.machine_id
      option.textContent = machine.machine_name
      select.appendChild(option)
    })
}

// ==================== FORM HANDLERS ====================
function handleAddMachine(event) {
  event.preventDefault()

  const newMachine = {
    machine_id: state.machines.length + 1,
    machine_name: document.getElementById("machine-name").value,
    machine_type: document.getElementById("machine-type").value,
    status: "available",
    capacity_kg: Number.parseFloat(document.getElementById("machine-capacity").value),
    location: document.getElementById("machine-location").value,
  }

  state.machines.push(newMachine)
  populateMachinesTable()
  populateBookMachineSelect()
  hideForms()
  alert("Machine added successfully!")
}

function handleAddEmployee(event) {
  event.preventDefault()

  const newEmployee = {
    user_id: state.users.length + 1,
    email: document.getElementById("emp-email").value,
    full_name: document.getElementById("emp-name").value,
    role: "employee",
    phone: document.getElementById("emp-phone").value,
  }

  state.users.push(newEmployee)
  populateEmployeesTable()
  hideForms()
  alert("Employee added successfully!")
}

function handleCustomerBooking(event) {
  event.preventDefault()

  const newBooking = {
    booking_id: state.bookings.length + 1,
    user_id: state.currentUser.user_id,
    machine_id: Number.parseInt(document.getElementById("book-machine-select").value),
    start_time: document.getElementById("book-start-time").value,
    status: "pending",
    cycle_duration: 45,
  }

  state.bookings.push(newBooking)
  alert("Booking request submitted! Awaiting employee approval.")
  document.getElementById("customer-book-form").reset()
  populateCustomerBookingsTable()
}

function handleCycleLog(event) {
  event.preventDefault()

  const newLog = {
    log_id: state.laundryLogs.length + 1,
    booking_id: Number.parseInt(document.getElementById("log-booking-select").value),
    weight_kg: Number.parseFloat(document.getElementById("log-weight").value),
    cycle_type: document.getElementById("log-cycle-type").value,
    temp_setting: document.getElementById("log-temp").value,
    spin_speed: Number.parseInt(document.getElementById("log-spin").value),
  }

  state.laundryLogs.push(newLog)
  alert("Cycle logged successfully!")
  document.getElementById("employee-log-form").reset()
  populateEmployeeLogsTable()
}

// ==================== ACTION HANDLERS ====================
function updateMachineStatus(machineId) {
  const status = prompt("Enter new status (available/in-use/maintenance):")
  if (status) {
    const machine = state.machines.find((m) => m.machine_id === machineId)
    if (machine) {
      machine.status = status
      populateMachinesTable()
      renderMachineStatus("admin-machine-status")
    }
  }
}

function updateMachineStatusEmployee(machineId, newStatus) {
  if (!newStatus) return
  const machine = state.machines.find((m) => m.machine_id === machineId)
  if (machine) {
    machine.status = newStatus
    populateEmployeeMachinesTable()
  }
}

function approveBooking(bookingId) {
  const booking = state.bookings.find((b) => b.booking_id === bookingId)
  if (booking) {
    booking.status = "in-progress"
    alert("Booking approved!")
    populateEmployeePendingTable()
    populateAllBookingsTable()
  }
}

function rejectBooking(bookingId) {
  const booking = state.bookings.find((b) => b.booking_id === bookingId)
  if (booking) {
    booking.status = "cancelled"
    alert("Booking rejected!")
    populateEmployeePendingTable()
  }
}

function cancelBooking(bookingId) {
  const booking = state.bookings.find((b) => b.booking_id === bookingId)
  if (booking) {
    booking.status = "cancelled"
    alert("Booking cancelled")
    populateCustomerBookingsTable()
  }
}

function completeMaintenance(machineId) {
  const machine = state.machines.find((m) => m.machine_id === machineId)
  if (machine) {
    machine.status = "available"
    alert("Machine maintenance complete!")
    populateEmployeeMaintenanceTable()
    populateEmployeeMachinesTable()
  }
}

function markMaintenance() {
  const machineId = Number.parseInt(document.getElementById("maintenance-machine-select").value)
  if (!machineId) {
    alert("Select a machine first")
    return
  }
  const machine = state.machines.find((m) => m.machine_id === machineId)
  if (machine) {
    machine.status = "maintenance"
    alert("Machine marked for maintenance")
    populateMaintenanceMachineSelect()
    populateEmployeeMaintenanceTable()
  }
}

function markNotificationRead(notificationId) {
  const notif = state.notifications.find((n) => n.notification_id === notificationId)
  if (notif) {
    notif.is_read = true
    populateCustomerNotifications()
  }
}

function removeEmployee(employeeId) {
  if (confirm("Remove this employee?")) {
    state.users = state.users.filter((u) => u.user_id !== employeeId)
    populateEmployeesTable()
  }
}

function viewCustomerDetails(customerId) {
  const customer = state.users.find((u) => u.user_id === customerId)
  alert(`Customer: ${customer.full_name}\nEmail: ${customer.email}\nPhone: ${customer.phone}`)
}

function editBooking(bookingId) {
  alert(`Edit booking #${bookingId}`)
}

function selectMachineForBooking(machineId) {
  showCustomerSection("book")
  document.getElementById("book-machine-select").value = machineId
  updateMachineDetails()
}

function updateMachineDetails() {
  const machineId = document.getElementById("book-machine-select").value
  if (!machineId) {
    document.getElementById("book-machine-type").textContent = "-"
    document.getElementById("book-machine-capacity").textContent = "-"
    document.getElementById("book-machine-location").textContent = "-"
    return
  }

  const machine = state.machines.find((m) => m.machine_id === Number.parseInt(machineId))
  if (machine) {
    document.getElementById("book-machine-type").textContent = machine.machine_type
    document.getElementById("book-machine-capacity").textContent = machine.capacity_kg + " kg"
    document.getElementById("book-machine-location").textContent = machine.location
  }
}

function loadBookingDetails() {
  // Placeholder for loading booking details
}

function loadUsageReport() {
  // Placeholder for usage report
  alert("Loading usage report...")
}

// ==================== UI HELPERS ====================
function showAddMachineForm() {
  document.getElementById("add-machine-form").classList.remove("form-hidden")
}

function showAddEmployeeForm() {
  document.getElementById("add-employee-form").classList.remove("form-hidden")
}

function hideForms() {
  document.getElementById("add-machine-form").classList.add("form-hidden")
  document.getElementById("add-employee-form").classList.add("form-hidden")
}

function setDefaultDateTime() {
  const now = new Date()
  const dateTime = now.toISOString().slice(0, 16)
  const input = document.getElementById("book-start-time")
  if (input) input.value = dateTime
}
