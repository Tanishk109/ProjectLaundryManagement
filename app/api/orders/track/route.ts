import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// Track order by order_id or customer_id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("order_id")
    const customerId = searchParams.get("customer_id")

    if (!orderId && !customerId) {
      return NextResponse.json({ error: "Order ID or Customer ID required" }, { status: 400 })
    }

    let sql = `
      SELECT o.*, u.full_name as customer_name, m.machine_name, m.location as machine_location
      FROM orders o 
      LEFT JOIN users u ON o.customer_id = u.customer_id 
      LEFT JOIN machines m ON o.machine_id = m.machine_id
      WHERE 
    `

    if (orderId) {
      sql += "o.order_id = ?"
      const orders = await query<unknown[]>(sql, [orderId])

      if (orders.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      // Get logs for this order
      const logs = await query<unknown[]>("SELECT * FROM laundry_logs WHERE order_id = ? ORDER BY created_at ASC", [
        orderId,
      ])

      return NextResponse.json({ order: orders[0], logs })
    } else {
      sql += "o.customer_id = ? ORDER BY o.created_at DESC"
      const orders = await query<unknown[]>(sql, [customerId])
      return NextResponse.json({ orders })
    }
  } catch (error) {
    console.error("Track order error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
