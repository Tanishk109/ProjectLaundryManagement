import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// Get users by role
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    let sql = "SELECT user_id, customer_id, email, full_name, role, phone, created_at FROM users"
    const params: string[] = []

    if (role) {
      sql += " WHERE role = ?"
      params.push(role)
    }

    sql += " ORDER BY created_at DESC"

    const users = await query<unknown[]>(sql, params)
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

// Register new user
export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, role, phone } = await request.json()

    // Validate required fields
    if (!email || !password || !full_name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists
    const existingUsers = await query<unknown[]>("SELECT * FROM users WHERE email = ?", [email])
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Generate customer_id for customers or employee_id for employees
    let customerId = null
    let generatedCode = null
    if (role === "customer") {
      // Generate unique customer ID
      let attempts = 0
      do {
        customerId = "CUS" + Math.random().toString(36).substring(2, 8).toUpperCase()
        const existing = await query<unknown[]>("SELECT * FROM users WHERE customer_id = ?", [customerId])
        attempts++
        if (attempts > 10) {
          return NextResponse.json({ error: "Failed to generate unique customer ID" }, { status: 500 })
        }
      } while (existing.length > 0)
      generatedCode = customerId
    } else if (role === "employee") {
      // Generate unique employee ID
      let attempts = 0
      do {
        customerId = "EMP" + Math.random().toString(36).substring(2, 8).toUpperCase()
        const existing = await query<unknown[]>("SELECT * FROM users WHERE customer_id = ?", [customerId])
        attempts++
        if (attempts > 10) {
          return NextResponse.json({ error: "Failed to generate unique employee ID" }, { status: 500 })
        }
      } while (existing.length > 0)
      generatedCode = customerId
    }

    await query("INSERT INTO users (customer_id, email, password, full_name, role, phone) VALUES (?, ?, ?, ?, ?, ?)", [
      customerId,
      email,
      password,
      full_name,
      role,
      phone,
    ])

    return NextResponse.json({
      success: true,
      customer_id: customerId,
      code: generatedCode,
      message: role === "customer" ? "Customer registered successfully" : "Employee registered successfully",
    })
  } catch (error) {
    console.error("Register user error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
