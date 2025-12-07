import mongoose, { Schema, Document } from "mongoose"

export interface IFeedback extends Document {
  customer_id: string
  order_id?: string
  rating: number
  comment?: string
  category: "service" | "machine" | "employee" | "general"
  created_at: Date
  updated_at: Date
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    customer_id: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    category: {
      type: String,
      enum: ["service", "machine", "employee", "general"],
      default: "general",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

export default mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema)

