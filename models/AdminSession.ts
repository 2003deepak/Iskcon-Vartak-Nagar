import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminSession extends Document {
  userId: mongoose.Types.ObjectId;
  refreshTokenJti: string;
  refreshTokenHash: string;
  userAgent?: string;
  ipAddress?: string;
  isRevoked: boolean;
  revokedAt?: Date;
  replacedByJti?: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSessionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
      index: true,
    },
    refreshTokenJti: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
    },
    userAgent: { type: String },
    ipAddress: { type: String },
    isRevoked: { type: Boolean, default: false, index: true },
    revokedAt: { type: Date },
    replacedByJti: { type: String },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Auto-delete expired sessions in MongoDB
    },
  },
  { timestamps: true, collection: "AdminSessions" }
);

const AdminSession: Model<IAdminSession> =
  mongoose.models.AdminSession ||
  mongoose.model<IAdminSession>("AdminSession", AdminSessionSchema, "AdminSessions");

export default AdminSession;
