import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Machine from "@/lib/models/Machine"

// Update machine status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ machineId: string }> }) {
  try {
    await connectDB()
    const { machineId } = await params
    const { status } = await request.json()

    await Machine.findByIdAndUpdate(machineId, { status })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update machine error:", error)
    return NextResponse.json({ error: "Failed to update machine" }, { status: 500 })
  }
}
