/**
 * Test Login and Registration
 * This script tests the API endpoints directly
 */

const http = require("http")

const BASE_URL = "http://localhost:3000"

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL)
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    }

    const req = http.request(url, options, (res) => {
      let body = ""
      res.on("data", (chunk) => {
        body += chunk
      })
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body)
          resolve({ status: res.statusCode, data: parsed })
        } catch (e) {
          resolve({ status: res.statusCode, data: body })
        }
      })
    })

    req.on("error", reject)

    if (data) {
      req.write(JSON.stringify(data))
    }

    req.end()
  })
}

async function testRegistration() {
  console.log("\n🧪 Testing Registration...")
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: "test123",
    full_name: "Test User",
    role: "customer",
    phone: "555-1234",
  }

  try {
    const result = await makeRequest("POST", "/api/users", testUser)
    if (result.status === 200 && result.data.success) {
      console.log("✅ Registration successful!")
      console.log("   Customer ID:", result.data.customer_id)
      return { ...testUser, customer_id: result.data.customer_id }
    } else {
      console.log("❌ Registration failed:", result.data.error)
      return null
    }
  } catch (error) {
    console.log("❌ Registration error:", error.message)
    return null
  }
}

async function testLogin(email, password) {
  console.log("\n🧪 Testing Login...")
  try {
    const result = await makeRequest("POST", "/api/auth/login", { email, password })
    if (result.status === 200 && result.data.user) {
      console.log("✅ Login successful!")
      console.log("   User:", result.data.user.email)
      console.log("   Role:", result.data.user.role)
      console.log("   Customer ID:", result.data.user.customer_id)
      return result.data.user
    } else {
      console.log("❌ Login failed:", result.data.error)
      return null
    }
  } catch (error) {
    console.log("❌ Login error:", error.message)
    return null
  }
}

async function runTests() {
  console.log("🚀 Starting API Tests...")
  console.log("⚠️  Make sure the dev server is running: npm run dev")

  // Test registration
  const registeredUser = await testRegistration()

  if (registeredUser) {
    // Test login with registered user
    await testLogin(registeredUser.email, registeredUser.password)
  }

  // Test login with existing admin (if seeded)
  console.log("\n🧪 Testing Admin Login...")
  await testLogin("admin@laundry.com", "admin123")

  console.log("\n✅ Tests completed!")
  console.log("\n💡 If tests fail, check:")
  console.log("   1. Dev server is running (npm run dev)")
  console.log("   2. MongoDB connection is working")
  console.log("   3. Check server console for errors")
}

// Wait a bit for server to be ready, then run tests
setTimeout(runTests, 2000)

