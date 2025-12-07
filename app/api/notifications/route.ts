import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// Get notifications for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const notifications = await query<unknown[]>(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
      [userId],
    )

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

// Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    const { notification_id } = await request.json()

    await query("UPDATE notifications SET is_read = TRUE WHERE notification_id = ?", [notification_id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update notification error:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}
