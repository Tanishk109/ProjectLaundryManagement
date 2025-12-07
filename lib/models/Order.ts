import mongoose, { Schema, Document } from "mongoose"

export interface IOrder extends Document {
  order_id: string
  customer_id: string
  machine_id?: mongoose.Types.ObjectId
  weight_kg: number
  cycle_type: string
  temp_setting: string
  spin_speed: number
  status: "pending" | "in-progress" | "washing" | "drying" | "ready" | "completed" | "cancelled"
  notes?: string
  estimated_completion?: Date
  actual_completion?: Date
  created_at: Date
  updated_at: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    customer_id: {
      type: String,
      required: true,
    },
    machine_id: {
      type: Schema.Types.ObjectId,
      ref: "Machine",
    },
    weight_kg: {
      type: Number,
    },
    cycle_type: {
      type: String,
      default: "Normal",
    },
    temp_setting: {
      type: String,
      default: "Warm",
    },
    spin_speed: {
      type: Number,
      default: 1200,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "washing", "drying", "ready", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
    },
    estimated_completion: {
      type: Date,
    },
    actual_completion: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

// Generate order_id before save if not provided
OrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.order_id) {
    let orderId: string
    let attempts = 0
    do {
      orderId = "ORD" + Math.random().toString(36).substring(2, 10).toUpperCase()
      const existing = await mongoose.model("Order").findOne({ order_id: orderId })
      attempts++
      if (attempts > 10) {
        return next(new Error("Failed to generate unique order ID"))
      }
    } while (existing)
    this.order_id = orderId
  }
  next()
})

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)

