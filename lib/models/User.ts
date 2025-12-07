import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  customer_id?: string
  email: string
  password: string
  full_name: string
  role: "admin" | "customer" | "employee"
  phone?: string
  created_at: Date
  updated_at: Date
}

const UserSchema = new Schema<IUser>(
  {
    customer_id: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer", "employee"],
      required: true,
    },
    phone: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

// Generate customer_id before save for customers and employees
UserSchema.pre("save", async function () {
  if (this.isNew && !this.customer_id) {
    // Get the User model (avoid circular reference)
    const UserModel = this.constructor as mongoose.Model<IUser>
    
    if (this.role === "customer") {
      let customerId: string
      let attempts = 0
      let existing
      do {
        customerId = "CUS" + Math.random().toString(36).substring(2, 8).toUpperCase()
        existing = await UserModel.findOne({ customer_id: customerId })
        attempts++
        if (attempts > 10) {
          throw new Error("Failed to generate unique customer ID")
        }
      } while (existing)
      this.customer_id = customerId
    } else if (this.role === "employee") {
      let employeeId: string
      let attempts = 0
      let existing
      do {
        employeeId = "EMP" + Math.random().toString(36).substring(2, 8).toUpperCase()
        existing = await UserModel.findOne({ customer_id: employeeId })
        attempts++
        if (attempts > 10) {
          throw new Error("Failed to generate unique employee ID")
        }
      } while (existing)
      this.customer_id = employeeId
    }
  }
})

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

