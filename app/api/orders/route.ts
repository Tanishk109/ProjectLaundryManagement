import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

interface Order {
  id: number
  order_id: string
  customer_id: string
  machine_id: number | null
  weight_kg: number
  cycle_type: string
  temp_setting: string
  spin_speed: number
  status: string
  notes: string
  created_at: string
}

// Get orders (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customer_id")
    const orderId = searchParams.get("order_id")
    const status = searchParams.get("status")

    let sql = `
      SELECT o.*, u.full_name as customer_name, m.machine_name 
      FROM orders o 
      LEFT JOIN users u ON o.customer_id = u.customer_id 
      LEFT JOIN machines m ON o.machine_id = m.machine_id
    `
    const params: string[] = []
    const conditions: string[] = []

    if (customerId) {
      conditions.push("o.customer_id = ?")
      params.push(customerId)
    }
    if (orderId) {
      conditions.push("o.order_id = ?")
      params.push(orderId)
    }
    if (status) {
      conditions.push("o.status = ?")
      params.push(status)
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ")
    }
    sql += " ORDER BY o.created_at DESC"

    const orders = await query<Order[]>(sql, params)
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

// Create new order
export async function POST(request: NextRequest) {
  try {
    const { customer_id, weight_kg, cycle_type, temp_setting, spin_speed, notes } = await request.json()

    // Generate unique order ID
    const orderId = "ORD" + Math.random().toString(36).substring(2, 10).toUpperCase()

    await query(
      `INSERT INTO orders (order_id, customer_id, weight_kg, cycle_type, temp_setting, spin_speed, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [orderId, customer_id, weight_kg, cycle_type, temp_setting, spin_speed, notes],
    )

    return NextResponse.json({ success: true, order_id: orderId })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
