import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/lib/models/Order"
import User from "@/lib/models/User"
import Machine from "@/lib/models/Machine"

// Get orders (with optional filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customer_id")
    const orderId = searchParams.get("order_id")
    const status = searchParams.get("status")

    const query: any = {}
    if (customerId) query.customer_id = customerId
    if (orderId) query.order_id = orderId
    if (status) query.status = status

    const orders = await Order.find(query)
      .populate("machine_id", "machine_name")
      .sort({ created_at: -1 })

    // Get customer names
    const customerIds = [...new Set(orders.map((o) => o.customer_id))]
    const users = await User.find({ customer_id: { $in: customerIds } })
    const customerMap = new Map(users.map((u) => [u.customer_id, u.full_name]))

    // Convert to format expected by frontend
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
      customer_name: customerMap.get(order.customer_id) || "",
      machine_name: order.machine_id && typeof order.machine_id === "object" ? order.machine_id.machine_name : "",
    }))

    return NextResponse.json({ orders: ordersResponse })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

// Create new order
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { customer_id, weight_kg, cycle_type, temp_setting, spin_speed, notes } = await request.json()

    // Generate unique order ID
    let orderId: string
    let attempts = 0
    do {
      orderId = "ORD" + Math.random().toString(36).substring(2, 10).toUpperCase()
      const existing = await Order.findOne({ order_id: orderId })
      attempts++
      if (attempts > 10) {
        return NextResponse.json({ error: "Failed to generate unique order ID" }, { status: 500 })
      }
    } while (existing)

    const newOrder = new Order({
      order_id: orderId,
      customer_id,
      weight_kg,
      cycle_type: cycle_type || "Normal",
      temp_setting: temp_setting || "Warm",
      spin_speed: spin_speed || 1200,
      notes: notes || "",
      status: "pending",
    })

    await newOrder.save()

    return NextResponse.json({ success: true, order_id: orderId })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
