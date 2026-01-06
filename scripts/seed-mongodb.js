/**
 * ⚠️ DEMO DATABASE SEED SCRIPT
 *
 * This script populates the database with demo users, machines, orders,
 * logs, and notifications for LOCAL DEVELOPMENT ONLY.
 *
 * ❌ DO NOT USE IN PRODUCTION
 * ❌ DO NOT COMMIT REAL CREDENTIALS
 */

const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")

/**
 * Manually load .env.local (no dotenv dependency required)
 */
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local")
  if (!fs.existsSync(envPath)) return

  const envFile = fs.readFileSync(envPath, "utf8")
  envFile.split("\n").forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) return

    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, "")
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
}

loadEnv()

// -----------------------------------------------------------------------------
// Environment validation
// -----------------------------------------------------------------------------

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/laundry_management"

const DEMO_PASSWORD = process.env.DEMO_PASSWORD

if (!DEMO_PASSWORD) {
  console.error("❌ DEMO_PASSWORD is not set in .env.local")
  process.exit(1)
}

// -----------------------------------------------------------------------------
// Import models
// -----------------------------------------------------------------------------

const User = require("../lib/models/User").default
const Machine = require("../lib/models/Machine").default
const Order = require("../lib/models/Order").default
const LaundryLog = require("../lib/models/LaundryLog").default
const Notification = require("../lib/models/Notification").default

// -----------------------------------------------------------------------------
// Seed function
// -----------------------------------------------------------------------------

async function seed() {
  try {
    console.log("🔌 Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected successfully")

    // Clear existing data
    console.log("🧹 Clearing existing data...")
    await Promise.all([
      User.deleteMany({}),
      Machine.deleteMany({}),
      Order.deleteMany({}),
      LaundryLog.deleteMany({}),
      Notification.deleteMany({}),
    ])

    // -------------------------------------------------------------------------
    // Seed Users
    // -------------------------------------------------------------------------

    console.log("👤 Seeding users...")

    const admin = await User.create({
      email: "admin@laundry.com",
      password: DEMO_PASSWORD,
      full_name: "Admin User",
      role: "admin",
      phone: "555-0001",
    })

    const customer1 = await User.create({
      email: "john@student.com",
      password: DEMO_PASSWORD,
      full_name: "John Smith",
      role: "customer",
      phone: "555-0002",
    })

    const customer2 = await User.create({
      email: "jane@student.com",
      password: DEMO_PASSWORD,
      full_name: "Jane Doe",
      role: "customer",
      phone: "555-0003",
    })

    const employee1 = await User.create({
      email: "emp@laundry.com",
      password: DEMO_PASSWORD,
      full_name: "Employee One",
      role: "employee",
      phone: "555-0004",
    })

    const employee2 = await User.create({
      email: "emp2@laundry.com",
      password: DEMO_PASSWORD,
      full_name: "Employee Two",
      role: "employee",
      phone: "555-0005",
    })

    console.log("✅ Users created")

    // -------------------------------------------------------------------------
    // Seed Machines
    // -------------------------------------------------------------------------

    console.log("🧺 Seeding machines...")

    const machines = await Machine.insertMany([
      {
        machine_name: "Washer A1",
        machine_type: "washer",
        status: "available",
        capacity_kg: 8.5,
        location: "Floor 1 - Room 101",
      },
      {
        machine_name: "Washer A2",
        machine_type: "washer",
        status: "in-use",
        capacity_kg: 8.5,
        location: "Floor 1 - Room 101",
      },
      {
        machine_name: "Washer B1",
        machine_type: "washer",
        status: "available",
        capacity_kg: 7.0,
        location: "Floor 2 - Room 201",
      },
      {
        machine_name: "Dryer A1",
        machine_type: "dryer",
        status: "available",
        capacity_kg: 6.0,
        location: "Floor 1 - Room 102",
      },
      {
        machine_name: "Dryer A2",
        machine_type: "dryer",
        status: "maintenance",
        capacity_kg: 6.0,
        location: "Floor 1 - Room 102",
      },
      {
        machine_name: "Dryer B1",
        machine_type: "dryer",
        status: "available",
        capacity_kg: 5.5,
        location: "Floor 2 - Room 202",
      },
    ])

    console.log(`✅ ${machines.length} machines created`)

    // -------------------------------------------------------------------------
    // Seed Orders
    // -------------------------------------------------------------------------

    console.log("📦 Seeding orders...")

    const order1 = await Order.create({
      order_id: "ORDM5K8X2A",
      customer_id: customer1.customer_id,
      machine_id: machines[1]._id,
      weight_kg: 5.2,
      cycle_type: "Normal",
      temp_setting: "Warm",
      spin_speed: 1200,
      status: "washing",
      notes: "Regular clothes",
    })

    const order2 = await Order.create({
      order_id: "ORDP3N7Y1B",
      customer_id: customer1.customer_id,
      machine_id: machines[4]._id,
      weight_kg: 3.5,
      cycle_type: "Delicate",
      temp_setting: "Cold",
      spin_speed: 800,
      status: "drying",
      notes: "Delicate items",
    })

    const order3 = await Order.create({
      order_id: "ORDK9M2X5C",
      customer_id: customer2.customer_id,
      machine_id: machines[0]._id,
      weight_kg: 4.0,
      cycle_type: "Heavy",
      temp_setting: "Hot",
      spin_speed: 1400,
      status: "pending",
      notes: "Bed sheets",
    })

    console.log(`✅ ${await Order.countDocuments()} orders created`)

    // -------------------------------------------------------------------------
    // Seed Laundry Logs
    // -------------------------------------------------------------------------

    console.log("📝 Seeding laundry logs...")

    await LaundryLog.create({
      order_id: order1.order_id,
      employee_id: employee1._id,
      action: "Started washing cycle",
      notes: "Machine A2 assigned",
    })

    await LaundryLog.create({
      order_id: order2.order_id,
      employee_id: employee1._id,
      action: "Moved to dryer",
      notes: "Dryer A2 assigned",
    })

    console.log(`✅ ${await LaundryLog.countDocuments()} logs created`)

    // -------------------------------------------------------------------------
    // Seed Notifications
    // -------------------------------------------------------------------------

    console.log("🔔 Seeding notifications...")

    await Notification.create({
      user_id: customer1._id,
      order_id: order1.order_id,
      message: "Your laundry is currently being washed",
      type: "alert",
      is_read: false,
    })

    await Notification.create({
      user_id: customer1._id,
      order_id: order2.order_id,
      message: "Your laundry is now in the dryer",
      type: "alert",
      is_read: false,
    })

    console.log(`✅ ${await Notification.countDocuments()} notifications created`)

    // -------------------------------------------------------------------------
    // Final Output
    // -------------------------------------------------------------------------

    console.log("\n🎉 Database seeded successfully!")
    console.log("All demo accounts use the same password:")
    console.log(`👉 DEMO_PASSWORD=${DEMO_PASSWORD}`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log("🔒 Database connection closed")
  }
}

seed()
