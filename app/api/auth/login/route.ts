import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB()
    console.log("✅ Database connected for login")

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email and password
    const user = await User.findOne({ email, password }).select("_id customer_id email full_name role phone")

    if (!user) {
      console.log("❌ Login failed: Invalid credentials for", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("✅ Login successful for:", user.email)

    // Convert to format expected by frontend
    const userResponse = {
      user_id: user._id.toString(),
      customer_id: user.customer_id || null,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone || "",
    }

    return NextResponse.json({ user: userResponse })
  } catch (error: any) {
    console.error("❌ Login error:", error)
    console.error("Error details:", error.message, error.stack)
    return NextResponse.json(
      { error: error.message || "Database connection failed" },
      { status: 500 }
    )
  }
}
