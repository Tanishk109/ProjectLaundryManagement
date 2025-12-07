import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    const user = await User.findOne({ email, password }).select("_id customer_id email full_name role phone")

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

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
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }
}
