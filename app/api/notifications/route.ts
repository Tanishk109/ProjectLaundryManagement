import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Notification from "@/lib/models/Notification"

// Get notifications for user
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const notifications = await Notification.find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(20)

    // Convert to format expected by frontend
    const notificationsResponse = notifications.map((notif) => ({
      notification_id: notif._id.toString(),
      user_id: notif.user_id.toString(),
      order_id: notif.order_id || null,
      message: notif.message,
      type: notif.type,
      is_read: notif.is_read,
      created_at: notif.created_at,
    }))

    return NextResponse.json({ notifications: notificationsResponse })
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

// Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    await connectDB()
    const { notification_id } = await request.json()

    await Notification.findByIdAndUpdate(notification_id, { is_read: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update notification error:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}
