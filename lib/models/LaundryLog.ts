import mongoose, { Schema, Document } from "mongoose"

export interface ILaundryLog extends Document {
  order_id: string
  employee_id?: mongoose.Types.ObjectId
  action?: string
  notes?: string
  created_at: Date
}

const LaundryLogSchema = new Schema<ILaundryLog>(
  {
    order_id: {
      type: String,
      required: true,
    },
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  },
)

export default mongoose.models.LaundryLog || mongoose.model<ILaundryLog>("LaundryLog", LaundryLogSchema)

