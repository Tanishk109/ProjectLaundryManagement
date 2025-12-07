/**
 * Create Admin User Script
 * Creates an admin account in MongoDB using native driver
 */

const { MongoClient } = require("mongodb")
const fs = require("fs")
const path = require("path")

// Read .env.local file
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
          const value = match[2].trim().replace(/^["']|["']$/g, "")
          if (!process.env[key]) {
            process.env[key] = value
          }
        }
      }
    })
  }
}

loadEnv()

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/laundry_management"

async function createAdmin() {
  let client
  try {
    console.log("🔌 Connecting to MongoDB...")
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("✅ Connected successfully!")

    const db = client.db("Laundry_Management")
    const usersCollection = db.collection("users")

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: "admin@laundry.com" })
    if (existingAdmin) {
      console.log("\n⚠️  Admin user already exists!")
      console.log("\n" + "=".repeat(50))
      console.log("🔐 ADMIN CREDENTIALS")
      console.log("=".repeat(50))
      console.log("📧 Email:    admin@laundry.com")
      console.log("🔑 Password: admin123")
      console.log("👤 Role:     admin")
      console.log("🆔 User ID:  " + existingAdmin._id.toString())
      console.log("=".repeat(50))
      await client.close()
      return
    }

    // Create admin user
    console.log("\n📝 Creating admin user...")
    const adminUser = {
      email: "admin@laundry.com",
      password: "admin123",
      full_name: "System Administrator",
      role: "admin",
      phone: "555-0001",
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await usersCollection.insertOne(adminUser)

    console.log("\n✅ Admin user created successfully!")
    console.log("\n" + "=".repeat(50))
    console.log("🔐 ADMIN CREDENTIALS")
    console.log("=".repeat(50))
    console.log("📧 Email:    admin@laundry.com")
    console.log("🔑 Password: admin123")
    console.log("👤 Role:     admin")
    console.log("🆔 User ID:  " + result.insertedId.toString())
    console.log("=".repeat(50))
    console.log("\n💡 You can now login with these credentials")
    console.log("⚠️  Please change the password after first login for security!")

    await client.close()
    process.exit(0)
  } catch (error) {
    console.error("\n❌ Error creating admin user:", error.message)
    if (error.code === 11000) {
      console.error("   Email already exists. Use different email or delete existing user.")
    }
    if (client) {
      await client.close()
    }
    process.exit(1)
  }
}

createAdmin()

