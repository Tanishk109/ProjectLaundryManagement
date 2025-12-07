import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

interface CountResult {
  count: number
}

// Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const customerId = searchParams.get("customer_id")

    if (role === "admin") {
      const [machines] = await query<CountResult[]>("SELECT COUNT(*) as count FROM machines")
      const [customers] = await query<CountResult[]>('SELECT COUNT(*) as count FROM users WHERE role = "customer"')
      const [employees] = await query<CountResult[]>('SELECT COUNT(*) as count FROM users WHERE role = "employee"')
      const [orders] = await query<CountResult[]>("SELECT COUNT(*) as count FROM orders")
      const [pendingOrders] = await query<CountResult[]>(
        'SELECT COUNT(*) as count FROM orders WHERE status = "pending"',
      )
      const [activeOrders] = await query<CountResult[]>(
        'SELECT COUNT(*) as count FROM orders WHERE status IN ("in-progress", "washing", "drying")',
      )

      return NextResponse.json({
        machines: machines.count,
        customers: customers.count,
        employees: employees.count,
        totalOrders: orders.count,
        pendingOrders: pendingOrders.count,
        activeOrders: activeOrders.count,
      })
    }

    if (role === "customer" && customerId) {
      const [totalOrders] = await query<CountResult[]>("SELECT COUNT(*) as count FROM orders WHERE customer_id = ?", [
        customerId,
      ])
      const [activeOrders] = await query<CountResult[]>(
        'SELECT COUNT(*) as count FROM orders WHERE customer_id = ? AND status IN ("pending", "in-progress", "washing", "drying")',
        [customerId],
      )
      const [completedOrders] = await query<CountResult[]>(
        'SELECT COUNT(*) as count FROM orders WHERE customer_id = ? AND status = "completed"',
        [customerId],
      )
      const [totalWeight] = await query<{ total: number }[]>(
        "SELECT COALESCE(SUM(weight_kg), 0) as total FROM orders WHERE customer_id = ?",
        [customerId],
      )

      return NextResponse.json({
        totalOrders: totalOrders.count,
        activeOrders: activeOrders.count,
        completedOrders: completedOrders.count,
        totalWeight: totalWeight.total,
      })
    }

    if (role === "employee") {
      const [pendingOrders] = await query<CountResult[]>(
        'SELECT COUNT(*) as count FROM orders WHERE status = "pending"',
      )
      const [activeOrders] = await query<CountResult[]>(
        'SELECT COUNT(*) as count FROM orders WHERE status IN ("in-progress", "washing", "drying")',
      )
      const [readyOrders] = await query<CountResult[]>('SELECT COUNT(*) as count FROM orders WHERE status = "ready"')
      const [availableMachines] = await query<CountResult[]>(
        'SELECT COUNT(*) as count FROM machines WHERE status = "available"',
      )

      return NextResponse.json({
        pendingOrders: pendingOrders.count,
        activeOrders: activeOrders.count,
        readyOrders: readyOrders.count,
        availableMachines: availableMachines.count,
      })
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
