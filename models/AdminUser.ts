import mongoose, { Schema, Document, Model } from "mongoose";

export type AdminRole = "superadmin" | "admin" | "editor";

export interface IAdminUser extends Document {
  name: string;
  email: string;
  username?: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: Date;
  passwordResetTokenHash?: string;
  passwordResetExpiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminUserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      sparse: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "editor"],
      default: "admin",
      required: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    lastLoginAt: { type: Date },
    passwordResetTokenHash: { type: String, index: true },
    passwordResetExpiresAt: { type: Date, index: true },
  },
  { timestamps: true, collection: "AdminUsers" }
);

const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>("AdminUser", AdminUserSchema, "AdminUsers");

export default AdminUser;
