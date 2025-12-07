import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/lib/models/Order"
import User from "@/lib/models/User"
import Machine from "@/lib/models/Machine"
import LaundryLog from "@/lib/models/LaundryLog"

// Track order by order_id or customer_id
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("order_id")
    const customerId = searchParams.get("customer_id")

    if (!orderId && !customerId) {
      return NextResponse.json({ error: "Order ID or Customer ID required" }, { status: 400 })
    }

    if (orderId) {
      const order = await Order.findOne({ order_id: orderId })
        .populate("machine_id", "machine_name location")

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      // Get customer info
      const user = await User.findOne({ customer_id: order.customer_id })
      const customer_name = user ? user.full_name : ""

      // Get logs
      const logs = await LaundryLog.find({ order_id: orderId }).sort({ created_at: 1 })

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
        machine_name: order.machine_id && typeof order.machine_id === "object" ? order.machine_id.machine_name : "",
        machine_location: order.machine_id && typeof order.machine_id === "object" ? (order.machine_id as any).location : "",
      }

      const logsResponse = logs.map((log) => ({
        log_id: log._id.toString(),
        order_id: log.order_id,
        employee_id: log.employee_id ? (typeof log.employee_id === "object" ? log.employee_id.toString() : log.employee_id) : null,
        action: log.action || "",
        notes: log.notes || "",
        created_at: log.created_at,
      }))

      return NextResponse.json({ order: orderResponse, logs: logsResponse })
    } else {
      // Get all orders for customer
      const orders = await Order.find({ customer_id: customerId })
        .populate("machine_id", "machine_name")
        .sort({ created_at: -1 })

      // Get customer name
      const user = await User.findOne({ customer_id: customerId })
      const customer_name = user ? user.full_name : ""

      const ordersResponse = orders.map((order) => ({
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
        machine_name: order.machine_id && typeof order.machine_id === "object" ? order.machine_id.machine_name : "",
      }))

      return NextResponse.json({ orders: ordersResponse })
    }
  } catch (error) {
    console.error("Track order error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
