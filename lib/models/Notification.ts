import mongoose, { Schema, Document } from "mongoose"

export interface INotification extends Document {
  user_id: mongoose.Types.ObjectId
  order_id?: string
  message: string
  type: "alert" | "reminder" | "complete" | "error" | "info"
  is_read: boolean
  created_at: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_id: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["alert", "reminder", "complete", "error", "info"],
      default: "alert",
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  },
)

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)

