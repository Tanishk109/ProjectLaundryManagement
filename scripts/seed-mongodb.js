/**
 * MongoDB Seed Script
 * Run this to populate your database with initial data
 * 
 * Usage: node scripts/seed-mongodb.js
 */

const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")

// Read .env.local file manually (no dotenv dependency needed)
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local")
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf8")
    envFile.split("\n").forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith("#")) {
        const match = trimmed.match(/^([^=]+)=(.*)$/)
        if (match) {
          const key = match[1].trim()
          const value = match[2].trim().replace(/^["']|["']$/g, "") // Remove quotes
          if (!process.env[key]) {
            process.env[key] = value
          }
        }
      }
    })
  }
}

loadEnv()

// Import models
const User = require("../lib/models/User").default
const Machine = require("../lib/models/Machine").default
const Order = require("../lib/models/Order").default
const LaundryLog = require("../lib/models/LaundryLog").default
const Notification = require("../lib/models/Notification").default

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/laundry_management"

async function seed() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("Connected successfully!")

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("Clearing existing data...")
    await User.deleteMany({})
    await Machine.deleteMany({})
    await Order.deleteMany({})
    await LaundryLog.deleteMany({})
    await Notification.deleteMany({})

    // Seed Users
    console.log("Seeding users...")
    const admin = await User.create({
      email: "admin@laundry.com",
      password: "admin123",
      full_name: "Admin User",
      role: "admin",
      phone: "555-0001",
    })

    const customer1 = await User.create({
      email: "john@student.com",
      password: "pass123",
      full_name: "John Smith",
      role: "customer",
      phone: "555-0002",
    })

    const customer2 = await User.create({
      email: "jane@student.com",
      password: "pass123",
      full_name: "Jane Doe",
      role: "customer",
      phone: "555-0003",
    })

    const employee1 = await User.create({
      email: "emp@laundry.com",
      password: "emp123",
      full_name: "Employee One",
      role: "employee",
      phone: "555-0004",
    })

    const employee2 = await User.create({
      email: "emp2@laundry.com",
      password: "emp123",
      full_name: "Employee Two",
      role: "employee",
      phone: "555-0005",
    })

    console.log("Users created:", {
      admin: admin.customer_id || "N/A",
      customer1: customer1.customer_id,
      customer2: customer2.customer_id,
      employee1: employee1.customer_id,
      employee2: employee2.customer_id,
    })

    // Seed Machines
    console.log("Seeding machines...")
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

    console.log(`Created ${machines.length} machines`)

    // Seed Orders
    console.log("Seeding orders...")
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

    console.log(`Created ${await Order.countDocuments()} orders`)

    // Seed Laundry Logs
    console.log("Seeding laundry logs...")
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

    console.log(`Created ${await LaundryLog.countDocuments()} logs`)

    // Seed Notifications
    console.log("Seeding notifications...")
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

    console.log(`Created ${await Notification.countDocuments()} notifications`)

    console.log("\n✅ Database seeded successfully!")
    console.log("\nLogin credentials:")
    console.log("Admin: admin@laundry.com / admin123")
    console.log("Customer: john@student.com / pass123")
    console.log("Employee: emp@laundry.com / emp123")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log("Database connection closed")
  }
}

seed()

