import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Machine from "@/lib/models/Machine"

// Get all machines
export async function GET() {
  try {
    await connectDB()
    const machines = await Machine.find().sort({ machine_name: 1 })

    // Convert to format expected by frontend
    const machinesResponse = machines.map((machine) => ({
      machine_id: machine._id.toString(),
      machine_name: machine.machine_name,
      machine_type: machine.machine_type,
      status: machine.status,
      capacity_kg: machine.capacity_kg,
      location: machine.location,
    }))

    return NextResponse.json({ machines: machinesResponse })
  } catch (error) {
    console.error("Get machines error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

// Add new machine
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { machine_name, machine_type, capacity_kg, location } = await request.json()

    const newMachine = new Machine({
      machine_name,
      machine_type,
      capacity_kg,
      location,
    })

    await newMachine.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Add machine error:", error)
    return NextResponse.json({ error: "Failed to add machine" }, { status: 500 })
  }
}
