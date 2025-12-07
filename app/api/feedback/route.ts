import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

interface Feedback {
  feedback_id: number
  customer_id: string
  order_id: string | null
  rating: number
  comment: string | null
  category: "service" | "machine" | "employee" | "general"
  created_at: string
  updated_at: string
}

// Get feedback (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customer_id")
    const orderId = searchParams.get("order_id")

    let sql = `
      SELECT f.*, u.full_name as customer_name, o.order_id as order_ref
      FROM feedback f
      LEFT JOIN users u ON f.customer_id = u.customer_id
      LEFT JOIN orders o ON f.order_id = o.order_id
    `
    const params: string[] = []
    const conditions: string[] = []

    if (customerId) {
      conditions.push("f.customer_id = ?")
      params.push(customerId)
    }
    if (orderId) {
      conditions.push("f.order_id = ?")
      params.push(orderId)
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ")
    }
    sql += " ORDER BY f.created_at DESC"

    const feedback = await query<Feedback[]>(sql, params)
    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Get feedback error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

// Create new feedback
export async function POST(request: NextRequest) {
  try {
    const { customer_id, order_id, rating, comment, category } = await request.json()

    // Validate required fields
    if (!customer_id || !rating) {
      return NextResponse.json({ error: "Customer ID and rating are required" }, { status: 400 })
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if feedback already exists for this order (if order_id provided)
    if (order_id) {
      const existingFeedback = await query<Feedback[]>(
        "SELECT * FROM feedback WHERE customer_id = ? AND order_id = ?",
        [customer_id, order_id],
      )
      if (existingFeedback.length > 0) {
        return NextResponse.json({ error: "Feedback already submitted for this order" }, { status: 400 })
      }
    }

    await query(
      `INSERT INTO feedback (customer_id, order_id, rating, comment, category) 
       VALUES (?, ?, ?, ?, ?)`,
      [customer_id, order_id || null, rating, comment || null, category || "general"],
    )

    return NextResponse.json({ success: true, message: "Feedback submitted successfully" })
  } catch (error) {
    console.error("Create feedback error:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}


