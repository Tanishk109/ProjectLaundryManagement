import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Machine from "@/lib/models/Machine"
import User from "@/lib/models/User"
import Order from "@/lib/models/Order"

// Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const customerId = searchParams.get("customer_id")

    if (role === "admin") {
      const machines = await Machine.countDocuments()
      const customers = await User.countDocuments({ role: "customer" })
      const employees = await User.countDocuments({ role: "employee" })
      const orders = await Order.countDocuments()
      const pendingOrders = await Order.countDocuments({ status: "pending" })
      const activeOrders = await Order.countDocuments({
        status: { $in: ["in-progress", "washing", "drying"] },
      })

      return NextResponse.json({
        machines,
        customers,
        employees,
        totalOrders: orders,
        pendingOrders,
        activeOrders,
      })
    }

    if (role === "customer" && customerId) {
      const totalOrders = await Order.countDocuments({ customer_id: customerId })
      const activeOrders = await Order.countDocuments({
        customer_id: customerId,
        status: { $in: ["pending", "in-progress", "washing", "drying"] },
      })
      const completedOrders = await Order.countDocuments({
        customer_id: customerId,
        status: "completed",
      })

      // Calculate total weight
      const orders = await Order.find({ customer_id: customerId })
      const totalWeight = orders.reduce((sum, order) => sum + (order.weight_kg || 0), 0)

      return NextResponse.json({
        totalOrders,
        activeOrders,
        completedOrders,
        totalWeight,
      })
    }

    if (role === "employee") {
      const pendingOrders = await Order.countDocuments({ status: "pending" })
      const activeOrders = await Order.countDocuments({
        status: { $in: ["in-progress", "washing", "drying"] },
      })
      const readyOrders = await Order.countDocuments({ status: "ready" })
      const availableMachines = await Machine.countDocuments({ status: "available" })

      return NextResponse.json({
        pendingOrders,
        activeOrders,
        readyOrders,
        availableMachines,
      })
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
