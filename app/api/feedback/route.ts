import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Feedback from "@/lib/models/Feedback"
import User from "@/lib/models/User"
import Order from "@/lib/models/Order"

// Get feedback (with optional filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customer_id")
    const orderId = searchParams.get("order_id")

    const query: any = {}
    if (customerId) query.customer_id = customerId
    if (orderId) query.order_id = orderId

    const feedbackList = await Feedback.find(query).sort({ created_at: -1 })

    // Get customer names and order references
    const customerIds = [...new Set(feedbackList.map((f) => f.customer_id))]
    const orderIds = [...new Set(feedbackList.map((f) => f.order_id).filter(Boolean))]

    const users = await User.find({ customer_id: { $in: customerIds } })
    const orders = await Order.find({ order_id: { $in: orderIds } })

    const customerMap = new Map(users.map((u) => [u.customer_id, u.full_name]))
    const orderMap = new Map(orders.map((o) => [o.order_id, o.order_id]))

    // Convert to format expected by frontend
    const feedbackResponse = feedbackList.map((fb) => ({
      feedback_id: fb._id.toString(),
      customer_id: fb.customer_id,
      order_id: fb.order_id || null,
      rating: fb.rating,
      comment: fb.comment || null,
      category: fb.category,
      created_at: fb.created_at,
      customer_name: customerMap.get(fb.customer_id) || "",
      order_ref: orderMap.get(fb.order_id || "") || null,
    }))

    return NextResponse.json({ feedback: feedbackResponse })
  } catch (error) {
    console.error("Get feedback error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

// Create new feedback
export async function POST(request: NextRequest) {
  try {
    await connectDB()
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
      const existingFeedback = await Feedback.findOne({ customer_id, order_id })
      if (existingFeedback) {
        return NextResponse.json({ error: "Feedback already submitted for this order" }, { status: 400 })
      }
    }

    const newFeedback = new Feedback({
      customer_id,
      order_id: order_id || undefined,
      rating,
      comment: comment || undefined,
      category: category || "general",
    })

    await newFeedback.save()

    return NextResponse.json({ success: true, message: "Feedback submitted successfully" })
  } catch (error) {
    console.error("Create feedback error:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}
