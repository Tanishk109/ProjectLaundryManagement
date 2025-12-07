import mongoose, { Schema, Document } from "mongoose"

export interface IMachine extends Document {
  machine_name: string
  machine_type: "washer" | "dryer"
  status: "available" | "in-use" | "maintenance"
  capacity_kg: number
  location: string
  created_at: Date
  updated_at: Date
}

const MachineSchema = new Schema<IMachine>(
  {
    machine_name: {
      type: String,
      required: true,
    },
    machine_type: {
      type: String,
      enum: ["washer", "dryer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "in-use", "maintenance"],
      default: "available",
    },
    capacity_kg: {
      type: Number,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

export default mongoose.models.Machine || mongoose.model<IMachine>("Machine", MachineSchema)

