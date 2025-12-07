import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// Update machine status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ machineId: string }> }) {
  try {
    const { machineId } = await params
    const { status } = await request.json()

    await query("UPDATE machines SET status = ? WHERE machine_id = ?", [status, machineId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update machine error:", error)
    return NextResponse.json({ error: "Failed to update machine" }, { status: 500 })
  }
}
