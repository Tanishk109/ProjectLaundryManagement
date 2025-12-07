import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// Update order status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params
    const { status, machine_id, employee_id, notes } = await request.json()

    // Update order status
    await query(
      "UPDATE orders SET status = ?, machine_id = COALESCE(?, machine_id), updated_at = NOW() WHERE order_id = ?",
      [status, machine_id, orderId],
    )

    // Log the action
    if (employee_id) {
      await query("INSERT INTO laundry_logs (order_id, employee_id, action, notes) VALUES (?, ?, ?, ?)", [
        orderId,
        employee_id,
        `Status changed to ${status}`,
        notes || "",
      ])
    }

    // Create notification for customer
    const orders = await query<{ customer_id: string }[]>("SELECT customer_id FROM orders WHERE order_id = ?", [
      orderId,
    ])

    if (orders.length > 0) {
      const statusMessages: Record<string, string> = {
        pending: "Your order has been received",
        "in-progress": "Your laundry is being processed",
        washing: "Your laundry is currently being washed",
        drying: "Your laundry is now in the dryer",
        ready: "Your laundry is ready for pickup!",
        completed: "Your order has been completed",
      }

      const users = await query<{ user_id: number }[]>("SELECT user_id FROM users WHERE customer_id = ?", [
        orders[0].customer_id,
      ])

      if (users.length > 0) {
        await query("INSERT INTO notifications (user_id, order_id, message, type) VALUES (?, ?, ?, ?)", [
          users[0].user_id,
          orderId,
          statusMessages[status] || "Order status updated",
          status === "ready" ? "complete" : "alert",
        ])
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

// Get single order with logs
export async function GET(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params

    const orders = await query<unknown[]>(
      `SELECT o.*, u.full_name as customer_name, u.phone as customer_phone, m.machine_name, m.location as machine_location
       FROM orders o 
       LEFT JOIN users u ON o.customer_id = u.customer_id 
       LEFT JOIN machines m ON o.machine_id = m.machine_id
       WHERE o.order_id = ?`,
      [orderId],
    )

    if (orders.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const logs = await query<unknown[]>(
      `SELECT l.*, u.full_name as employee_name 
       FROM laundry_logs l 
       LEFT JOIN users u ON l.employee_id = u.user_id 
       WHERE l.order_id = ? 
       ORDER BY l.created_at DESC`,
      [orderId],
    )

    return NextResponse.json({ order: orders[0], logs })
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
