import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// Get all machines
export async function GET() {
  try {
    const machines = await query<unknown[]>("SELECT * FROM machines ORDER BY machine_name")
    return NextResponse.json({ machines })
  } catch (error) {
    console.error("Get machines error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

// Add new machine
export async function POST(request: NextRequest) {
  try {
    const { machine_name, machine_type, capacity_kg, location } = await request.json()

    await query("INSERT INTO machines (machine_name, machine_type, capacity_kg, location) VALUES (?, ?, ?, ?)", [
      machine_name,
      machine_type,
      capacity_kg,
      location,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Add machine error:", error)
    return NextResponse.json({ error: "Failed to add machine" }, { status: 500 })
  }
}
