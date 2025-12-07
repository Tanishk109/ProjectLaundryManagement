import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/lib/models/Order"
import User from "@/lib/models/User"
import Machine from "@/lib/models/Machine"
import LaundryLog from "@/lib/models/LaundryLog"
import Notification from "@/lib/models/Notification"

// Update order status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    await connectDB()
    const { orderId } = await params
    const { status, machine_id, employee_id, notes } = await request.json()

    // Update order status
    const updateData: any = { status }
    if (machine_id) {
      updateData.machine_id = machine_id
    }

    await Order.findOneAndUpdate({ order_id: orderId }, updateData)

    // Log the action
    if (employee_id) {
      const newLog = new LaundryLog({
        order_id: orderId,
        employee_id,
        action: `Status changed to ${status}`,
        notes: notes || "",
      })
      await newLog.save()
    }

    // Create notification for customer
    const order = await Order.findOne({ order_id: orderId })
    if (order) {
      const user = await User.findOne({ customer_id: order.customer_id })
      if (user) {
        const statusMessages: Record<string, string> = {
          pending: "Your order has been received",
          "in-progress": "Your laundry is being processed",
          washing: "Your laundry is currently being washed",
          drying: "Your laundry is now in the dryer",
          ready: "Your laundry is ready for pickup!",
          completed: "Your order has been completed",
        }

        const newNotification = new Notification({
          user_id: user._id,
          order_id: orderId,
          message: statusMessages[status] || "Order status updated",
          type: status === "ready" ? "complete" : "alert",
        })
        await newNotification.save()
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
    await connectDB()
    const { orderId } = await params

    const order = await Order.findOne({ order_id: orderId }).populate("machine_id", "machine_name location")

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get customer info
    const user = await User.findOne({ customer_id: order.customer_id })
    const customer_name = user ? user.full_name : ""
    const customer_phone = user ? user.phone || "" : ""

    // Get logs
    const logs = await LaundryLog.find({ order_id: orderId })
      .populate("employee_id", "full_name")
      .sort({ created_at: -1 })

    // Convert to format expected by frontend
    const orderResponse = {
      id: order._id.toString(),
      order_id: order.order_id,
      customer_id: order.customer_id,
      machine_id: order.machine_id ? (typeof order.machine_id === "object" ? order.machine_id._id.toString() : order.machine_id) : null,
      weight_kg: order.weight_kg,
      cycle_type: order.cycle_type,
      temp_setting: order.temp_setting,
      spin_speed: order.spin_speed,
      status: order.status,
      notes: order.notes || "",
      created_at: order.created_at,
      customer_name,
      customer_phone,
      machine_name: order.machine_id && typeof order.machine_id === "object" ? order.machine_id.machine_name : "",
      machine_location: order.machine_id && typeof order.machine_id === "object" ? (order.machine_id as any).location : "",
    }

    const logsResponse = logs.map((log) => ({
      log_id: log._id.toString(),
      order_id: log.order_id,
      employee_id: log.employee_id ? (typeof log.employee_id === "object" ? log.employee_id._id.toString() : log.employee_id) : null,
      action: log.action || "",
      notes: log.notes || "",
      created_at: log.created_at,
      employee_name: log.employee_id && typeof log.employee_id === "object" ? (log.employee_id as any).full_name : "",
    }))

    return NextResponse.json({ order: orderResponse, logs: logsResponse })
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
