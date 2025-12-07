import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

interface User {
  user_id: number
  customer_id: string | null
  email: string
  full_name: string
  role: "admin" | "customer" | "employee"
  phone: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const users = await query<User[]>(
      "SELECT user_id, customer_id, email, full_name, role, phone FROM users WHERE email = ? AND password = ?",
      [email, password],
    )

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]
    return NextResponse.json({ user })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }
}
